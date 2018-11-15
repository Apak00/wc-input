# adesso-input
A Web Component for input field.

Feel free to make your "Pull Request" 🏆

  ### installation:
  `npm install adesso-input --save`

  To use this web component, you need to install "validator.js" aswell. If you dont already have it

  `npm install validator --save`

  ### usage:
  first include script to your js or html file

  ```
    import "adesso-input";
  ```
  then in your html or jsx
  ```
  <adesso-input
    label="Email"
    type="email"
    animated
    validation-rules="email,required">
      <i slot="rightIcon" className="fas fa-dragon"/>
  </adesso-input>
  ```
  
![](input_field_gif.gif)

  ## Attributes:

  | Attribute | Description | type | default| required |
  | --- | --- | --- | --- | --- |
  | `label` | label above input field | String | none | no |
  | `type` | Input type | String | none | yes |
  | `animated` | label is static if this attiribute does not exist | Boolean | false | no |
  | `invalid` | set this as input exptected to be invalid | Boolean | false | no |
  | `minlenght` | minimum number of character for validation | String | none | no |
  | `maxlength` | maximum number of character enabled | String | none | no |
  | `validation-rules` | put your validation rules as a string added with comma, variations: `email`,`required`,`alpha`,`minlength` | String | none | no |

