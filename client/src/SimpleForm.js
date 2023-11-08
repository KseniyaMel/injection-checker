import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import xssFilters from 'xss-filters';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  field: yup
    .string()
    .matches(/^(?!(<script>|<\/script>)).*$/),
});

function SimpleForm() {
  const formRef = React.createRef();
  const [validator, setValidator] = useState('DOMPurify');
  const [resInput, setResInput] = useState(null);

  const handleSimpleInput = async (e) => {
    e.preventDefault();
    const text = e.target.elements.text.value;

    switch(validator){
      case 'DOMPurify': {
        if(text === DOMPurify.sanitize(text)){
          setResInput('valid')
         } else {
          setResInput('not valid')
         }
         return;
      }
      case 'xssFilters': {
        if(xssFilters.inHTMLData(text) === text){
          setResInput('valid')
         } else {
          setResInput('not valid')
         }
         return;
      }
      case 'yup': {
        const validateText = await validationSchema.validate({ field: text})
        if(validateText.field === text){
          setResInput('valid')
         } else {
          setResInput('not valid')
         }
         return;
      }
      default: {
        setResInput('valid');
        return;
      }
    }
  };

  const handleChangeValidator = (e) => {
    formRef.current.reset();
    setResInput(null);
    setValidator(e.target.value);
  }

  return (
    <div>
      <div onChange={handleChangeValidator}>
        <input type="radio" value="none" name="validator" /> None
        <input type="radio" value="DOMPurify" name="validator" /> DOMPurify
        <input type="radio" value="xssFilters" name="validator" /> xssFilters
        <input type="radio" value="yup" name="validator" /> yup
      </div>

      <form 
        ref={formRef}
        onSubmit={handleSimpleInput}
        noValidate
        >
        <label>
          Simple Form:
          <input name="text" id='form_input' type="text"/>
        </label>
        <button id="submit_button" type="submit">Submit</button>
      </form>
      <div id='result'>{resInput}</div>
    </div>
  );
}

export default SimpleForm;
