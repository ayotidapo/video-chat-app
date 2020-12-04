/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react';
import { uniqueId } from 'lodash';

export const CheckBox = props => {
  const [id] = useState(uniqueId('Checkbox'));
  const [isChecked, setIsChecked] = useState(props.initialChecked);

  const onChange = e => {
    const isChecked = e.target.checked;
    setIsChecked(isChecked);
  };
  useEffect(() => {
    if (typeof props.onChange === 'function') {
      props.onChange(isChecked);
    }
  }, [isChecked]);

  return (
    <div>
      <label htmlFor={id}>{props.label}</label>

      <input type="checkbox" checked={isChecked} id={id} onChange={onChange} />
    </div>
  );
};
