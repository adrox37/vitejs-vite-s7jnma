const gender = [
  { name: '', value: '' },
  { name: 'Male', value: 'M' },
  { name: 'Female', value: 'F' },
];

const fruit = [
  { name: 'Carrot', value: 'orange', group: 'Vegetables' },
  { name: 'Cucumber', value: 'green', group: 'Vegetables' },
  { name: 'Aubergine', value: 'purple', group: 'Vegetables' },
  { name: 'Blueberry', value: 'Blue', group: 'Fruits' },
  { name: 'Banana', value: 'yellow', group: 'Fruits' },
  { name: 'Strawberry', value: 'red', group: 'Fruits' },
];

const config = [
  {
    section: {
      legend: '',
      attrs: {},
      fields: [
        {
          key: 'firstName',
          control: 'input',
          attrs: {
            type: 'text',
            label: 'First Name',
          },
          messaging: {
            validation: {
              required: {
                message: 'First Name is required',
                value: true,
              },
              minLength: {
                message: 'First Name must be at least 3 characters',
                value: 3,
              },
              maxLength: {
                message: 'First Name must fewer than 5 characters',
                value: 5,
              },
              pattern: {
                message: 'First Name must be alphanumeric',
                value: '"^[a-zA-Z0-9]+$"',
              },
            },
            help: {},
          },
        },
        {
          key: 'lastName',
          control: 'input',
          attrs: {
            type: 'text',
            label: 'Last Name',
          },
          messaging: {
            validation: {
              required: {
                message: 'Last Name is required',
                value: true,
              },
            },
            help: {},
          },
        },
        {
          key: 'middleName',
          control: 'input',
          attrs: {
            type: 'text',
            label: 'Middle Initial',
            readonly: true,
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
        {
          key: 'active',
          control: 'checkbox',
          attrs: {
            type: 'string',
            label: 'active',
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
        {
          key: 'title',
          control: 'input',
          attrs: {
            type: 'text',
            label: 'Title',
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
        {
          key: 'suffix',
          control: 'input',
          attrs: {
            type: 'text',
            label: 'Suffix',
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
        {
          key: 'birthDate',
          control: 'input',
          attrs: {
            type: 'date',
            label: 'Date Of Birth',
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
        {
          key: 'genderCode',
          control: 'select',
          attrs: {
            type: 'select',
            label: 'Gender',
            options: gender,
          },
          messaging: {
            validation: {
              required: {
                message: 'Gender is required',
                value: true,
              },
            },
            help: {},
          },
        },
        {
          key: 'companyName',
          control: 'input',
          attrs: {
            type: 'text',
            label: 'Company Name',
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
        {
          key: 'saveBtn',
          control: 'button',
          attrs: {
            type: 'submit',
            label: 'Save',
            style: 'primary',
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
      ],
    },
  },
];

// const config = [{
//   section: {
//     legend: '',
//     attrs: {
//     },
//     fields: [
//       {
//         key: 'firstName',
//         control: 'input',
//         attrs: {
//           type: 'text',
//           label: 'First Name',
//         },
//         messaging: {
//           validation: {
//             required: {
//               message: 'First Name is required',
//               value: true
//             },
//             minLength: {
//               message: 'First Name must be at least 3 characters',
//               value: 3
//             },
//             maxLength: {
//               message: 'First Name must fewer than 5 characters',
//               value: 5
//             },
//             pattern: {
//               message: 'First Name must be alphanumeric',
//               value: '[Bb]anana|[Cc]herry'
//             }
//           },
//           help: {}
//         }
//       },
//     ]
//   }
// }]

const fieldset = [
  {
    section: {
      legend: 'Member Info',
      attrs: {},
      fields: [
        {
          key: 'firstName',
          control: 'input',
          attrs: {
            type: 'string',
            label: 'First Name',
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
        {
          key: 'lastName',
          control: 'input',
          attrs: {
            type: 'text',
            label: 'Last Name',
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
      ],
    },
  },
  {
    section: {
      legend: 'Contact Info',
      attrs: {},
      fields: [
        {
          key: 'email',
          control: 'input',
          attrs: {
            type: 'email',
            label: 'Email Address',
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
        {
          key: 'phone',
          control: 'input',
          attrs: {
            type: 'tel',
            label: 'Phone Number',
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
      ],
    },
  },
  {
    section: {
      legend: '',
      attrs: {
        key: 'active',
        type: 'checkbox',
        attrs: {
          type: 'checkbox',
          label: 'active',
        },
        messaging: {
          validation: {},
          help: {},
        },
      },
      fields: [
        {
          key: 'someText',
          control: 'input',
          attrs: {
            type: 'text',
            label: 'Some field',
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
        {
          key: 'someSelect',
          control: 'select',
          attrs: {
            type: 'select',
            placeholder: 'Select a fruit',
            label: 'Some field',
            options: fruit,
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
      ],
    },
  },
  {
    section: {
      legend: '',
      attrs: {
        key: 'sel',
        type: 'select',
        attrs: {
          type: 'select',
          placeholder: 'Select a fruit',
          label: '',
          options: fruit,
        },
        messaging: {
          validation: {},
          help: {},
        },
      },
      fields: [
        {
          key: 'someText',
          control: 'input',
          attrs: {
            type: 'text',
            label: 'Some field',
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
      ],
    },
  },
  {
    section: {
      legend: '',
      attrs: {},
      fields: [
        {
          key: 'saveBtn',
          control: 'button',
          attrs: {
            type: 'submit',
            label: 'Save',
            style: 'primary',
          },
          messaging: {
            validation: {},
            help: {},
          },
        },
      ],
    },
  },
];

export { config, fieldset };
