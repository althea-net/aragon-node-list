import React from 'react';
import PropTypes from 'prop-types';
import { Button, DropDown, Field, SidePanel, Text, TextInput } from '@aragon/ui';
import { translate } from 'react-i18next';
import { Row, Col } from 'react-flexbox-grid';

class GenerateReport extends React.Component {
  state = {
    name: '',
    type: 0,
    format: 0,
    start: '01/01/19',
    end: '12/31/19',
    columns: {
      address: false,
      nickname: false,
      amount: false,
      date: false,
      reference: false
    }
  };

  onChange = e => {
    console.log(e);
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  setType = i => this.setState({ type: i })
  setFormat = i => this.setState({ format: i })

  render () {
    const types = ['Finance'];
    const formats = ['CSV'];
    const { opened, t } = this.props;
    const { name, type, format, start, end, columns } = this.state;

    return (
      <SidePanel title="Generate Report" opened={opened}>
        <Field label={t('reportName')}>
          <TextInput wide
            type="text"
            name="name"
            onChange={this.onChange}
            value={name}
          />
        </Field>
        <Row>
          <Col xs={6}>
            <Field label={t('reportType')}>
              <DropDown
                items={types}
                active={type}
                onChange={this.setType}
              />
            </Field>
          </Col>
          <Col>
            <Field label={t('fileType')}>
              <DropDown
                items={formats}
                active={format}
                onChange={this.setFormat}
              />
            </Field>
          </Col>
        </Row>
        <hr style={{ border: '1px solid #eee' }} />
        <Row>
          <Col xs={6}>
            <Field label={t('periodStart')}>
              <TextInput wide
                type="text"
                name="start"
                onChange={this.onChange}
                value={start}
              />
            </Field>
          </Col>
          <Col>
            <Field label={t('periodEnd')}>
              <TextInput wide
                type="text"
                name="end"
                onChange={this.onChange}
                value={end}
              />
            </Field>
          </Col>
        </Row>

        <div>
          <input id="address" type="checkbox" value={columns.address} />
          <label htmlFor="address">Recipient Address</label>
        </div>
        <div>
          <input id="nickname" type="checkbox" value={columns.nickname} />
          <label htmlFor="nickname">Recipient Nickname</label>
        </div>
        <div>
          <input id="amount" type="checkbox" value={columns.amount} />
          <label htmlFor="amount">Transaction Amount</label>
        </div>
        <div>
          <input id="date" type="checkbox" value={columns.date} />
          <label htmlFor="date">Transaction Date</label>
        </div>
        <div>
          <input id="reference" type="checkbox" value={columns.reference} />
          <label htmlFor="reference">Transaction Reference</label>
        </div>
        <Button mode="strong" wide style={{ marginTop: 20 }}>Generate Report</Button>
      </SidePanel>
    );
  }
};

GenerateReport.propTypes = {
  t: PropTypes.object,
  opened: PropTypes.bool
};

export default translate()(GenerateReport);
