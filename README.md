# adesso-input
A Web Component for input field.

Feel free to make your "Pull Request" 🏆

  ### installation:
  `npm install adesso-input --save`

  To use this web component, you need to install "validator.js" aswell. If you dont already have it

  `npm install validator --save`

  ### usage:
  first import script to your page

  ```
    import "adesso-input";
  ```
  then in your markup
  ```
    <adesso-input 
        required
        type="email"
        label="label"
        animated
        minlength="5"
        maxlength="20"
        alpha="tr-TR">
      <i slot="rightIcon" className="fas fa-dragon"/>
    </adesso-input>
  ```
  
![](input_field_gif.gif)

  ## Attributes:

  | Attribute | Description | type | default| required |
  | --- | --- | --- | --- | --- |
  | `alpha` | language code and alpha character validation | String | none | no |
  | `animated` | label is static if this attiribute does not exist | Boolean | false | no |
  | `invalid` | set this as input exptected to be invalid | Boolean | false | no |
  | `label` | label above input field | String | none | no |
  | `maxlength` | maximum number of character enabled | String | none | no |
  | `minlength` | minimum number of character for validation | String | none | no |
  | `required` | empty validation | Boolean | none | no |
  | `type` | Input type | String | none | yes |
  
  ## Future:
  
  - [ ] Notify parent component about "errorkey". Possible solition would be firing a custom event
 
    
  ## Team:
  
    @cagdascan


