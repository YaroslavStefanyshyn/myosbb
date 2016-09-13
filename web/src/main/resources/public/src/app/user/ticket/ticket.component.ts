import {RouterConfig,RouterOutlet} from "@angular/router";
import {Component, OnInit} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {MODAL_DIRECTIVES, BS_VIEW_PROVIDERS} from 'ng2-bootstrap/ng2-bootstrap';
import {ModalDirective} from "ng2-bootstrap/ng2-bootstrap";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {PageCreator} from "../../../shared/services/page.creator.interface";
import {IMessage,Message} from './single_ticket/message'
import {Ticket, ITicket,TicketState} from './ticket';
import { TicketService } from './ticket.service';
import { TicketAddFormComponent } from './ticket_form/ticket-add-form.component';
import { TicketEditFormComponent } from './ticket_form/ticket-edit-form.component';
import { TicketDelFormComponent } from './ticket_form/ticket-del-form.component';
import { MessageComponent } from './single_ticket/single.ticket.component';
import { MessageService } from './single_ticket/single.ticket.service';
import {Router} from '@angular/router';
import {TranslatePipe} from "ng2-translate";
import {CapitalizeFirstLetterPipe} from "../../../shared/pipes/capitalize-first-letter";
import {RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import {User} from './../user';
import {CurrentUserService} from "./../../../shared/services/current.user.service";
import {Notice} from './../../header/notice';
import {NoticeService} from './../../header/header.notice.service';
import {PageRequest} from './generator';
import {HeaderComponent} from "../../header/header.component";
import {ToasterContainerComponent, ToasterService} from "angular2-toaster/angular2-toaster";
import {
    onErrorResourceNotFoundToastMsg,
    onErrorServerNoResponseToastMsg
} from "../../../shared/error/error.handler.component";
@Component({
    selector: 'ticket',
    templateUrl: './src/app/user/ticket/ticket.component.html',
    providers: [ TicketService, MessageComponent, ToasterService, MessageService],
    directives: [RouterOutlet, ROUTER_DIRECTIVES, MODAL_DIRECTIVES, CORE_DIRECTIVES, TicketAddFormComponent, TicketEditFormComponent, TicketDelFormComponent],
    viewProviders: [BS_VIEW_PROVIDERS],
    pipes: [TranslatePipe],
    styleUrls: ['src/app/user/ticket/ticket.css']
})


export class TicketComponent implements OnInit {

    private messageService:MessageService;
    private ticketArr:ITicket[] = [];
    private updatedTicket:ITicket;
    private messageArr:IMessage[] = [];
    private message:Message;
    private currentUser:User;
    private dates:string[] = [];
    private pageCreator:PageCreator<Ticket>;
    private pageNumber:number = 1;
    private pageList:Array<number> = [];
    private totalPages:number;
    private pending = false;
    private selectedRow:number = 10;
    private order:boolean = false;
    nameSort:string = "time";
    status:string = "";
    email:string = "";
    emailAssign:string = "";
    pageRequest:PageRequest;
_currentUserService = null;
    constructor(private ticketService:TicketService,
                private messageComponent:MessageComponent,
                private currentUserService:CurrentUserService,
                private _toasterService: ToasterService,
                private router:Router) {
         this._currentUserService=HeaderComponent.currentUserService;
        this.currentUser = this._currentUserService.getUser();
         
        console.log("TICKET USER : "+ this.currentUser.firstName+"  "+this.currentUser.lastName);
        
    }

    ngOnInit() {
        this.getTicketsByPageNum(this.pageNumber, this.selectedRow);
    }

    initUpdatedTicket(ticket:ITicket):void {
        this.updatedTicket = ticket;
    }

    createTicket(ticket:ITicket):void {
        this.ticketService.addTicket(ticket).then(ticket => this.addTicket(ticket));
    }

     private handleErrors(error: any) {
        if (error.status === 404 || error.status === 400) {
            console.log('server error 400');
            this._toasterService.pop(onErrorResourceNotFoundToastMsg);
            return;
        }

        if (error.status === 500) {
            console.log('server error 500');
            this._toasterService.pop(onErrorServerNoResponseToastMsg);
            return;
        }
    }
    private addTicket(ticket:ITicket):void {
       // this.ticketService.sendEmailAssign(ticket.ticketId);
        this.ticketArr.unshift(ticket);
    }

    editTicket(ticket:ITicket):void {
        this.ticketService.editTicket(ticket); 
       // .then( setTimeout => this.ticketArr[index] = this.ticketService.getTicketbyId(ticket.ticketId), 1000);
        let index = this.ticketArr.indexOf(this.updatedTicket);
             console.log("TICKET: "+JSON.stringify(this.updatedTicket));
               
               //   this.ticketService.getTicketbyId(ticket.ticketId);
        if (index > -1) {
             console.log("НАШЕЛСЯ ТИКЕТ"+ticket.ticketId);

          this.ticketArr[index]= ticket;
         //  this.ticketService.getTicketbyId(ticket.ticketId).then(ticket => this.ticketArr[index] = ticket);
          //  .then( setTimeout => this.ticketArr[index] = this.ticketService.getTicketbyId(ticket.ticketId), 1000);
        }
      
    }


    deleteTicket(ticket:ITicket):void {
        this.ticketService.deleteTicket(ticket).then(ticket => this.deleteTicketFromArr(ticket));
    }


    private deleteTicketFromArr(ticket:ITicket):void {
        let index = this.ticketArr.indexOf(ticket);
        if (index > -1) {
            this.ticketArr.splice(index, 1);
        }
    }

    findTicketByName(name:string) {
        this.pending = true;
         this.pageRequest = new PageRequest(this.pageNumber, this.selectedRow,this.nameSort,this.order);
        return this.ticketService.findByNameDescription(this.pageRequest, name)
            .subscribe((data) => {
                    this.pending = false;
                    this.pageCreator = data;
                    this.ticketArr = data.rows;
                    this.preparePageList(+this.pageCreator.beginPage,
                        +this.pageCreator.endPage);
                    this.totalPages = +data.totalPages;
                    this.dates = data.dates;
                },
                (error) => {
                    this.pending = false;
                    console.error(error)
                });
    }

  findMyTickets() {
        this.pending = true;
        this.emailAssign = '';        
        this.email = this.currentUser.email;
        this.pageRequest = new PageRequest(this.pageNumber, this.selectedRow,this.nameSort,this.order);
        return this.ticketService.findByUser(this.pageRequest, this.email, this.status)
            .subscribe((data) => {
                    this.pending = false;
                    this.pageCreator = data;
                    this.ticketArr = data.rows;
                    this.preparePageList(+this.pageCreator.beginPage,
                                         +this.pageCreator.endPage);
                    this.totalPages = +data.totalPages;
                    this.dates = data.dates;
                 //   this.status="";
                },
                (error) => {
                    this.pending = false;
                    console.error(error)
                });
               
    }

    findMyAssigned() {
        this.pending = true;
        this.email = '';        
        this.emailAssign = this.currentUser.email;
        this.pageRequest = new PageRequest(this.pageNumber, this.selectedRow,this.nameSort,this.order);
        return this.ticketService.findByAssigned(this.pageRequest, this.emailAssign, this.status)
           .subscribe((data) => {
                    this.pending = false;
                    this.pageCreator = data;
                    this.ticketArr = data.rows;
                    this.preparePageList(+this.pageCreator.beginPage,
                        +this.pageCreator.endPage);
                    this.totalPages = +data.totalPages;
                    this.dates = data.dates;
                 //   this.status="";
                },
                (error) => {
                    this.pending = false;
                    console.error(error)
                });
    }

     findTicketByState(state:string) {
        this.pending = true;
        this.status = state;
        if(this.email != ""){
            this.findMyTickets();
        }
        else if(this.emailAssign != ""){
            this.findMyAssigned();
        }
        else{
        this.pageRequest = new PageRequest(this.pageNumber, this.selectedRow,this.nameSort,this.order);
        return this.ticketService.findByState(this.pageRequest, state)
            .subscribe((data) => {
                    this.pending = false;
                    this.pageCreator = data;
                    this.ticketArr = data.rows;
                    this.preparePageList(+this.pageCreator.beginPage,
                        +this.pageCreator.endPage);
                    this.totalPages = +data.totalPages;
                    this.dates = data.dates;
                },
                (error) => {
                    this.pending = false;
                    console.error(error)
                });
     }
    }

    singleTicket(id:number) {
        this.router.navigate(['home/user/ticket', id]);
    }


    getTime(time:Date):string {
        return new Date(time).toLocaleString();
    }

    selectRowNum(row:number) {
        console.log("selectRowNum");
        
        if(this.status != ""){
            this.findTicketByState(this.status);
        }
        else if(this.email != ""){
            this.findMyTickets();
        }
        else {this.getTicketsByPageNum(this.pageNumber, row);
        }
       
    }

    prevPage() {
        console.log("prevPage");
        
        this.pageNumber = this.pageNumber - 1;
        if(this.status != ""){
            this.findTicketByState(this.status);
        } else if(this.email != ""){
            this.findMyTickets();
        } else if(this.emailAssign != ""){
            this.findMyAssigned();
        } else {        
       /// this.sortBy(this.nameSort);
       this.getTicketsByPageNum(this.pageNumber,this.selectedRow);
       
        }
    }

    nextPage() {
        console.log("nextPage");
        
        this.pageNumber = this.pageNumber + 1;
       // this.sortBy(this.nameSort);
       this.getTicketsByPageNum(this.pageNumber,this.selectedRow);
       
    }

    initPageNum(pageNumber:number, selectedRow:number) {
        console.log("initPageNum");
        
        this.pageNumber = +pageNumber;
        this.selectedRow = +selectedRow;

        if(this.status != ""){
            this.findTicketByState(this.status);
        } else if(this.email != ""){
            this.findMyTickets();
        } else if(this.emailAssign != ""){
            this.findMyAssigned();
        } else{  
       // this.sortBy(this.nameSort);
       this.getTicketsByPageNum(pageNumber,selectedRow);
         }
    }

    getTicketsByPageNum(pageNumber:number, selectedRow:number) {
        console.log("getTicketsByPageNum");
        this.pageNumber = +pageNumber;
        this.pending = true;
        this.selectedRow = +selectedRow;
        this.email ='';
        this.emailAssign =''; 
        this.status='';       
        this.pageRequest = new PageRequest(this.pageNumber, this.selectedRow,this.nameSort,this.order);
        return this.ticketService.getTicketsByPage(this.pageRequest)
            .subscribe((data) => {
                    this.pending = false;
                    this.pageCreator = data;
                    this.ticketArr = data.rows;
                    this.preparePageList(+this.pageCreator.beginPage,
                        +this.pageCreator.endPage);
                    this.totalPages = +data.totalPages;
                    this.dates = data.dates;
                },
                (error) => {
                    this.pending = false;
                    console.error(error)
                });
    }

    emptyArray() {
        while (this.pageList.length) {
            this.pageList.pop();
        }
    }

    preparePageList(start:number, end:number) {
        this.emptyArray();
        for (let i = start; i <= end; i++) {
            this.pageList.push(i);
        }
    }

    sortBy(name:string) {
        console.log("sortBy");
        this.emailAssign = '';
        this.email = '';
        this.status ='';
        if (name != '') {
            this.nameSort = name;
            this.order = !this.order;
        }
        this.pageRequest = new PageRequest(this.pageNumber, this.selectedRow,this.nameSort,this.order);
        return this.ticketService.getTicketsSorted(this.pageRequest)
             .subscribe((data) => {
                    this.pageCreator = data;
                    this.ticketArr = data.rows;
                    this.preparePageList(+this.pageCreator.beginPage,
                        +this.pageCreator.endPage);
                    this.totalPages = +data.totalPages;
                },
                (error) => {
                    console.error(error)
                });
    }
}