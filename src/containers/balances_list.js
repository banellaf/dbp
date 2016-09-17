import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { connect } from 'react-redux';
import moment from 'moment';
import numeral from 'numeral';
import { getCashBalancesQueryResults } from '../selectors';

class BalancesList extends Component {

  asJson() {
    return [...this.props.results].map((balance) => {
      return balance.toJS();
    });
  };

  amountFormatter(cell, row) {
    const format = '0,0[.]00';
    const currencies = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£',
      'JPY': '¥'
    }

    let symbol = currencies[row.currency];
    if (symbol === undefined) {
      symbol = row.currency;
    }

    return `${numeral(row.amount).format(format)} ${symbol}`;
  }

  dateFormatter(cell, row) {
    return moment.unix(cell / 1000).format('DD/MM/YYYY');
  }

  render() {
    if (!this.props.results || this.props.results.size === 0) {
      return (
        <Panel collapsible defaultExpanded header="List" bsStyle="success">
          <div>No rows available</div>
        </Panel>
      );
    }

    return (
      <Panel collapsible defaultExpanded header="List" bsStyle="success">
        <BootstrapTable
          data={this.asJson()}
          striped={true}
          hover={true}
          condensed={true}
          search={true}>
          <TableHeaderColumn dataField="id" isKey={true} hidden={true} dataAlign="right" dataSort={true}>Id</TableHeaderColumn>
          <TableHeaderColumn dataField="account" dataAlign="right" dataSort={true}>Account</TableHeaderColumn>
          <TableHeaderColumn dataField="accountName" dataAlign="right" dataSort={true}>Account Name</TableHeaderColumn>
          <TableHeaderColumn dataField="amount" dataAlign="right" dataSort={true} dataFormat={this.amountFormatter}>Amount</TableHeaderColumn>
          <TableHeaderColumn dataField="date" dataAlign="right" dataSort={true} dataFormat={this.dateFormatter}>Date</TableHeaderColumn>
        </BootstrapTable>
      </Panel>
    );
  };
}


const mapStateToProps = (state) => {
  return {
    results: getCashBalancesQueryResults(state)
  }
}

export default connect(mapStateToProps)(BalancesList);
