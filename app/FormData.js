export default class FormData {
  constructor(validators, that) {
    this.validators = validators;
    this.that = that;
  }

  onFieldChange = e => {
    const { name, value } = e.target;

    this.that.setState({
      fields: {
        ...this.that.state.fields,
        [name]: value
      },

      valid: {
        ...this.that.state.valid,
        [name]: this.validators[name] && this.validators[name](value)
      }
    });
  };

  isFieldValid = name => {
    return this.that.state.fields && this.that.state.fields[name]
      ? this.that.state.valid && this.that.state.valid[name]
      : undefined;
  };
}
