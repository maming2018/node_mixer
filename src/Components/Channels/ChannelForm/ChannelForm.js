import React, { useState, useEffect } from 'react';
import axios from '../../../Config/axios';

import Validate from '../../../Helpers/Validate';

import './ChannelForm.css';

const initialFormState = {
  channelName: {
    value: '',
    valid: false,
    touched: false,
    validationRules: {
      minLength: 2,
      isRequired: true
    },
  },
  channelId: {
    value: '',
    valid: false,
    touched: false,
    validationRules: {
      minLength: 2,
      isRequired: false
    },
  }
};


const ChannelForm = props => {

  const [isLoading, setisLoading] = useState(false);
  const [isNewItem, setIsNewItem] = useState(true);
  const [formData, setFormData] = useState(initialFormState)
  const [formIsValid, setFormIsValid] = useState(true)

  useEffect(() => {
    // console.log("USE EFFECT CHANNELFORM.JS");

    if (props.defaultValue.id !== "new") {
      const editFormState = {
        ...initialFormState,
        channelName: {
          ...initialFormState['channelName'],
          value: props.defaultValue.channelName,
          valid: true,
        },
        channelId: {
          ...initialFormState['channelId'],
          value: props.defaultValue.channelId,
          valid: true,
        },
      }
      setIsNewItem(false)
      setFormIsValid(true)
      setFormData(editFormState)
    }

  }, [props.defaultValue])

  const updateHandler = () => {
    setisLoading(true)
    const data = {
      channelName: formData.channelName.value,
      channelId: formData.channelId.value,
    }

    if (isNewItem === true) {
      axios.post('/channels', data).then(response => {
        // console.log("Success: ", response)
        setisLoading(false)
        props.updateHandler('created', response.data);
        props.responseUpdate({ type: 'success', value: 'Keyword inserted' });
      }).catch(e => {
        console.log("Error: ", e)
        setisLoading(false)
        props.responseUpdate({ type: 'danger', value: 'Something went wrong while update' });
      })
    }
    else {

      const updatedData = {
        ...data,
        id: props.defaultValue.id
      }

      axios.patch('/channels', updatedData).then(response => {
        console.log("Success: ", response)
        setisLoading(false)
        props.updateHandler('updated', updatedData);
        props.responseUpdate({ type: 'success', value: 'Keyword updated' });
      }).catch(e => {
        setisLoading(false)
        console.log("Error: ", e)
        props.responseUpdate({ type: 'danger', value: 'Something went wrong while update' });
      })
    }
  }

  const inputChangehandler = (event) => {

    const inputIdentifier = event.target.name;
    const val = event.target.value;

    const updatedFormData = {
      ...formData,
      [inputIdentifier]: {
        ...formData[inputIdentifier],
        value: val,
        valid: Validate(val, formData[inputIdentifier].validationRules),
        touched: true,
      }
    }

    setFormData(updatedFormData);
    let formIsValid = true;

    let inputID;
    for (inputID in updatedFormData) {
      formIsValid = updatedFormData[inputID].valid && formIsValid
    }

    setFormIsValid(formIsValid)
    inputClassNameHandler(inputIdentifier)
  }

  const inputClassNameHandler = (inputIdentifier) => {

    const content = {
      ...formData
    }

    if (content[inputIdentifier].touched && !content[inputIdentifier].valid) {
      return "form-control is-invalid";
    } else if (content[inputIdentifier].touched && content[inputIdentifier].valid) {
      return "form-control is-valid";
    } else {
      return "form-control"
    }
  }

  return (
    <div className="modal-centered">
      <div>
        <h4>
          <span className="badge badge-light">{isNewItem === true ? 'Add ' : 'Edit '} Channel</span>
        </h4>
        <hr style={{ marginTop: 0 }} />
        <form onSubmit={updateHandler}>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label">Channel Name</label>
            <div className="col-sm-9">
              <input
                name="channelName"
                type="text"
                className={inputClassNameHandler('channelName')}
                onChange={inputChangehandler}
                value={formData.channelName.value}
                placeholder="channel Name" />
              <span className="invalid-feedback">Please enter valid channel name. Minimum {formData.channelName.validationRules.minLength} character required.</span>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label">Channel Id</label>
            <div className="col-sm-9">
              <input
                name="channelId"
                type="text"
                className={inputClassNameHandler('channelId')}
                onChange={inputChangehandler}
                value={formData.channelId.value}
                placeholder="Channel Id" />
            </div>
          </div>

          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9">

              {isLoading ?
                <button className="btn btn-sm btn-success" type="button" disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  &nbsp;&nbsp;{isNewItem === true ? 'Creating' : 'Updating'}...
              </button>
                :
                <button type="button" className="btn btn-sm btn-success" disabled={!formIsValid} onClick={updateHandler}>{isNewItem === true ? 'Add' : 'Update'}</button>
              }
              <button type="button" className="btn btn-sm btn-secondary ml-3" onClick={props.cancelHandler}>Cancel</button>

            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChannelForm;
