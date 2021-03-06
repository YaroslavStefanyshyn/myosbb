package com.softserve.osbb.model;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.softserve.osbb.model.enums.Periodicity;

/**
 * Created by Anastasiia Fedorak on 05.07.2016.
 */
@Entity
@Table(name = "provider")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Provider implements Serializable {
    
    private static final long serialVersionUID = 1L;
    public static final Periodicity DEFAULT_PERIODICITY = Periodicity.ONE_TIME;
    private Integer providerId;
    private String name;
    private String description;
    private String logoUrl;
    private Collection<Contract> contracts;
    private Collection<Bill> bills;
    private Periodicity periodicity;
    private ProviderType type;
    private String email;
    private String phone;
    private String address;
    private String schedule;
    private boolean active;

    private List<Attachment> attachments;

    public Provider() {
    }

    public Provider(String name) {
        this.name = name;
    }

    public Provider(String name, String description) {
        this.name = name;
        this.description = description;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "provider_id")
    public Integer getProviderId() {
        return providerId;
    }

    public void setProviderId(Integer providerId) {
        this.providerId = providerId;
    }

    @Column(name = "logoUrl")
    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Column(name = "description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL)
    @JsonIgnore
    public Collection<Contract> getContracts() {
        return contracts;
    }

    public void setContracts(Collection<Contract> contracts) {
        this.contracts = contracts;
    }

    @OneToMany(mappedBy = "provider")
    @JsonIgnore
    public Collection<Bill> getBills() {
        return bills;
    }

    public void setBills(Collection<Bill> bills) {
        this.bills = bills;
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "periodicity", columnDefinition = "varchar(45) default 'ONE_TIME'")
    public Periodicity getPeriodicity(){
        return periodicity;
    }

    public void setPeriodicity(Periodicity periodicity){
        this.periodicity = periodicity;
    }

    @ManyToOne
    @JoinColumn(name = "provider_type_id")
    public ProviderType getType() {
        return type;
    }

    public void setType(ProviderType type) {
        this.type = type;
    }

    @Column(name = "email")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Column(name = "phone")
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @Column(name = "address")
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Column(name = "schedule")
    public String getSchedule() {
        return schedule;
    }

    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }

    @Column(name = "active", columnDefinition = "boolean default false")
    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "provider_attachment",
            joinColumns = { @JoinColumn(name = "provider_id") }, inverseJoinColumns = { @JoinColumn(name = "attachment_id") })
    public List<Attachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<Attachment> attachments) {
        this.attachments = attachments;
    }

    @Override
    public boolean equals(Object obj) {
        return EqualsBuilder.reflectionEquals(this, obj);
    }

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this);
    }
}
