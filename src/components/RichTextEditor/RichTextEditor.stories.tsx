import React from 'reactn';
import RichTextEditor from 'components/RichTextEditor/RichTextEditor';
import {storiesOf} from '@storybook/react';
import nameof from 'ts-nameof.macro';

export const title: string = 'RichTextEditor';

function Default() {
  const [value, setValue] = React.useState<string>('');

  const changeOutside = React.useCallback(
    () => {
      setValue('Set value from outside');
    },
    [],
  );

  return (
    <>
      <button className="btn btn-sm btn-primary" onClick={changeOutside}>
        Change value from outside
      </button>
      <RichTextEditor value={value} onChange={setValue}/>

      <span>
        {value}
      </span>
    </>
  );
}

storiesOf('RichTextEditor', module)
  .add(nameof(Default), Default);
