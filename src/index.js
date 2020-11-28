import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
//import { TextInput } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

export const App = ({sdk}) => {
  const [value, setValue] = useState(sdk.field.getValue() || '');
  const Dropdown4TypeOrField=sdk.parameters.instance.Dropdown4TypeOrField;
  const ContentTypeDependencyEntryID=sdk.parameters.instance.ContentTypeDependencyEntryID;
  const ContentFieldDependencyEntryID=sdk.parameters.instance.ContentFieldDependencyEntryID;
  const ContentTypeFieldName=sdk.parameters.instance.ContentTypeFieldName;
  const ContentFieldFieldName=sdk.parameters.instance.ContentFieldFieldName;
  const [contenttypelist,setContenttypelist]=useState([]);
  const [contentfieldlist,setContentfieldlist]=useState([]);
  const [selectedvalueoftype,setSelectedValueOfType]=useState(sdk.entry.fields[ContentTypeFieldName].getValue());
  

  const handleTypeSelectChange=(e)=>{
    const newValue=e.currentTarget.value;
    setValue(newValue);
    sdk.field.setValue(newValue);
    sdk.entry.fields[ContentFieldFieldName].setValue('Please Select Content Field'); //this to trigger the Content Field Field to be refreshed and you must NOT use empty string
  }

  const handleFieldSelectChange=(e)=>{
    const newValue=e.currentTarget.value;
    setValue(newValue);
    sdk.field.setValue(newValue);
  }

  const onExternalChange = value => {
    setValue(value);
    //console.log(Dropdown4TypeOrField);
    if(Dropdown4TypeOrField==="ContentField"){
      setSelectedValueOfType(sdk.entry.fields[ContentTypeFieldName].getValue());
    }    
  }

  // const onChange = e => {
  //   const value = e.currentTarget.value;
  //   setValue(value);
  //   if (value) {
  //     sdk.field.setValue(value);
  //   } else {
  //     sdk.field.removeValue();
  //   }
  // }

  useEffect(() => {
    sdk.window.startAutoResizer();
    
    if(Dropdown4TypeOrField==='ContentType'){
      sdk.space.getEntry(ContentTypeDependencyEntryID)
      .then((entry)=>{
        //console.log(entry);
        setContenttypelist(entry.fields.changeDetail['en-CA'].sort((a,b)=>(a.contentTypeName>b.contentTypeName)?1:-1));
      })
      .catch((err)=>console.log(err));
    }

    if(Dropdown4TypeOrField==='ContentField'){
      //first I need to get the Content Type field value
      const cntType=sdk.entry.fields[ContentTypeFieldName].getValue();
      //console.log(cntType);
      if(cntType !==undefined && cntType !=='Please Select Content Type'){
        sdk.space.getEntry(ContentFieldDependencyEntryID)
        .then((entry)=>{
          //console.log(entry);
          setContentfieldlist(entry.fields.changeDetail['en-CA'][cntType]);
        })
        .catch((err)=>console.log(err));
      } 
    }
  }, []);
  
  useEffect(()=>{
    if(Dropdown4TypeOrField==='ContentField'){
      //first I need to get the Content Type field value
      const cntType=sdk.entry.fields[ContentTypeFieldName].getValue();
      //console.log(cntType);
      if(cntType !==undefined && cntType !=='Please Select Content Type'){
        sdk.space.getEntry(ContentFieldDependencyEntryID)
        .then((entry)=>{
          //console.log(entry);
          setContentfieldlist(entry.fields.changeDetail['en-CA'][cntType]);
        })
        .catch((err)=>console.log(err));
      }
      
    }
  },[selectedvalueoftype])

  useEffect(() => {
    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    const detatchValueChangeHandler = sdk.field.onValueChanged(onExternalChange);
    return detatchValueChangeHandler;
  });

  if(Dropdown4TypeOrField==="ContentField"){
    return (
      <div className='singleSelectRaw'>
        {/* <TextInput
        width="large"
        type="text"
        id="my-field"
        testId="my-field"
        value={value}
        onChange={onChange}
      /> */}
      <select value={value} onChange={handleFieldSelectChange}>
        <option key={9999} value='Please Select Content Field'>Please Select Content Field</option>
        {
            contentfieldlist.map((fld,idx)=>{
                return<option key={idx} value={fld.fieldID}>
                    {fld.fieldName}
                </option>
            })
        }
      </select>
      </div>
    );
  } else {
    return (
      <div className='singleSelectRaw'>
      <select value={value} onChange={handleTypeSelectChange}>
        <option key={9999} value='Please Select Content Type'>Please Select Content Type</option>
        {
            contenttypelist.map((he,idx)=>{
                return<option key={idx} value={he['contentTypeID']}>
                    {he['contentTypeName']}
                </option>
            })
        }
      </select>
      </div>
    );
  }
  
}

App.propTypes = {
  sdk: PropTypes.object.isRequired
};

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
