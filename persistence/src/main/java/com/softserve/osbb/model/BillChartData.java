package com.softserve.osbb.model;

import java.io.Serializable;

/**
 * Created by nazar.dovhyy on 28.08.2016.
 */
public class BillChartData implements Serializable {

	private static final long serialVersionUID = 1L;
	private Double totalPercentagePaid;
    private Double totalPercentageDebt;

    public Double getTotalPercentagePaid() {
        return totalPercentagePaid;
    }

    public void setTotalPercentagePaid(Double totalPercentagePaid) {
        this.totalPercentagePaid = totalPercentagePaid;
    }

    public Double getTotalPercentageDebt() {
        return totalPercentageDebt;
    }

    public void setTotalPercentageDebt(Double totalPercentageDebt) {
        this.totalPercentageDebt = totalPercentageDebt;
    }

    @Override
    public String toString() {
        return "BillChartData{" +
                "totalPercentagePaid=" + totalPercentagePaid +
                ", totalPercentageDebt=" + totalPercentageDebt +
                '}';
    }
}
