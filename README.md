# adesso-input
A Web Component for input field.

Feel free to make your "Pull Request" 🏆

  # installation:
  `npm install adesso-input --save`

  To use this web component, you need to install "validator.js" aswell. If you dont already have it

  `npm install validator --save`

  # usage:
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

