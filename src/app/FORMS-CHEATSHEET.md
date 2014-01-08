```
FormController
  methods:
    $addControl() // Register a control with the form. Input elements using ngModelController do this automatically when they are linked.
    $removeControl() // Deregister a control from the form. Input elements using ngModelController do this automatically when they are destroyed.
    $setDirty()  // Sets the form to a dirty state. This method can be called to add the 'ng-dirty' class and set the form to a dirty state (ng-dirty class). This method will also propagate to parent forms.
    $setPristine() // Sets the form to its pristine state. This method can be called to remove the 'ng-dirty' class and set the form to its pristine state (ng-pristine class). This method will also propagate to all the controls contained in this form. Setting a form back to a pristine state is often useful when we want to 'reuse' a form after saving or resetting it.
    $setValidity()  // Sets the validity of a form control. This method will also propagate to parent forms.
  properties:
    $pristine  // True if user has not interacted with the form yet.
    $dirty // True if user has already interacted with the form.
    $valid // True if all of the containing forms and controls are valid.
    $invalid // True if at least one containing control or form is invalid.
    $error
      Is an object hash, containing references to all invalid controls or forms, where:
        keys are validation tokens (error names),
        values are arrays of controls or forms that are invalid for given error name.
        Built-in validation tokens:
          email
          max
          maxlength
          min
          minlength
          number
          pattern
          required
          url


form
  <form [name="{string}"]> </form>
input
  <input
         ng-model="{string}" // Assignable angular expression to data-bind to.
         [name="{string}"]  //Property name of the form under which the control is published.
         [required]  // Sets required validation error key if the value is not entered.
         [ng-required="{boolean}"]  // Sets required attribute if set to true
         [ng-minlength="{number}"]  // Sets minlength validation error key if the value is shorter than minlength.
         [ng-maxlength="{number}"]  // Sets maxlength validation error key if the value is longer than maxlength.
         [ng-pattern="{string}"]  // Sets pattern validation error key if the value does not match the RegExp pattern expression. Expected value is /regexp/ for inline patterns or regexp for patterns defined as scope expressions.
         [ng-change="{string}"]>  // Angular expression to be executed when input changes due to user interaction with the input element.
  </input>
input.checkbox
  <input type="checkbox"
       ng-model="{string}" // Assignable angular expression to data-bind to.
       [name="{string}"]  //Property name of the form under which the control is published.
       [ng-true-value="{string}"]  // The value to which the expression should be set when selected.
       [ng-false-value="{string}"]  // The value to which the expression should be set when not selected.
       [ng-change="{string}"]>  // Angular expression to be executed when input changes due to user interaction with the input element.
input.email
  <input type="email"
       ng-model="{string}" // Assignable angular expression to data-bind to.
       [name="{string}"]  //Property name of the form under which the control is published.
       [required]  // Sets required validation error key if the value is not entered.
       [ng-required="{string}"]  // Adds required attribute and required validation constraint to the element when the ngRequired expression evaluates to true. Use ngRequired instead of required when you want to data-bind to the required attribute.
       [ng-minlength="{number}"]  // Sets minlength validation error key if the value is shorter than minlength.
       [ng-maxlength="{number}"]  // Sets maxlength validation error key if the value is longer than maxlength.
       [ng-pattern="{string}"]  // Sets pattern validation error key if the value does not match the RegExp pattern expression. Expected value is /regexp/ for inline patterns or regexp for patterns defined as scope expressions.
       [ng-change="{string}"]>  // Angular expression to be executed when input changes due to user interaction with the input element.
input.number
  <input type="number"
       ng-model="{string}" // Assignable angular expression to data-bind to.
       [name="{string}"]  //Property name of the form under which the control is published.
       [min="{string}"]
       [max="{string}"]
       [required]  // Sets required validation error key if the value is not entered.
       [ng-required="{string}"]  // Adds required attribute and required validation constraint to the element when the ngRequired expression evaluates to true. Use ngRequired instead of required when you want to data-bind to the required attribute.
       [ng-minlength="{number}"]  // Sets minlength validation error key if the value is shorter than minlength.
       [ng-maxlength="{number}"]  // Sets maxlength validation error key if the value is longer than maxlength.
       [ng-pattern="{string}"]  // Sets pattern validation error key if the value does not match the RegExp pattern expression. Expected value is /regexp/ for inline patterns or regexp for patterns defined as scope expressions.
       [ng-change="{string}"]>  // Angular expression to be executed when input changes due to user interaction with the input element.
input.radio
  <input type="radio"
       ng-model="{string}" // Assignable angular expression to data-bind to.
       value="{string}"
       [name="{string}"]  //Property name of the form under which the control is published.
       [ng-change="{string}"]>  // Angular expression to be executed when input changes due to user interaction with the input element.
input.text
  <input type="text"
       ng-model="{string}" // Assignable angular expression to data-bind to.
       [name="{string}"]  //Property name of the form under which the control is published.
       [required]  // Sets required validation error key if the value is not entered.
       [ng-required="{string}"]  // Adds required attribute and required validation constraint to the element when the ngRequired expression evaluates to true. Use ngRequired instead of required when you want to data-bind to the required attribute.
       [ng-minlength="{number}"]  // Sets minlength validation error key if the value is shorter than minlength.
       [ng-maxlength="{number}"]  // Sets maxlength validation error key if the value is longer than maxlength.
       [ng-pattern="{string}"]  // Sets pattern validation error key if the value does not match the RegExp pattern expression. Expected value is /regexp/ for inline patterns or regexp for patterns defined as scope expressions.
       [ng-change="{string}"]  // Angular expression to be executed when input changes due to user interaction with the input element.
       [ng-trim="{boolean}"]>
input.url
  <input type="url"
       ng-model="{string}" // Assignable angular expression to data-bind to.
       [name="{string}"]  //Property name of the form under which the control is published.
       [required]  // Sets required validation error key if the value is not entered.
       [ng-required="{string}"]  // Adds required attribute and required validation constraint to the element when the ngRequired expression evaluates to true. Use ngRequired instead of required when you want to data-bind to the required attribute.
       [ng-minlength="{number}"]  // Sets minlength validation error key if the value is shorter than minlength.
       [ng-maxlength="{number}"]  // Sets maxlength validation error key if the value is longer than maxlength.
       [ng-pattern="{string}"]  // Sets pattern validation error key if the value does not match the RegExp pattern expression. Expected value is /regexp/ for inline patterns or regexp for patterns defined as scope expressions.
       [ng-change="{string}"]>  // Angular expression to be executed when input changes due to user interaction with the input element.
ngChecked
  <INPUT ng-checked="{expression}"> ... </INPUT>
ngChange
  <input ng-change="{expression}"> ... </input>
ngList
  <input ng-list="{string}"> ... </input>
ngOpen
  <collapsedElement ng-open="{expression}"> ... </collapsedElement>
ngSelected
  <OPTION ng-selected="{expression}"> ... </OPTION>
ngReadonly
  <INPUT ng-readonly="{expression}"> ... </INPUT>
ngSubmit
  <form ng-submit="{expression}"> ... </form>
ngValue
  <form ng-submit="{expression}"> ... </form>

select
  <select ng-model="color" ng-options="c.name group by c.shade for c in colors"></select>
  <select
         ng-model="{string}" // Assignable angular expression to data-bind to.
         [name="{string}"]  //Property name of the form under which the control is published.
         [required]  // Sets required validation error key if the value is not entered.
         [ng-required="{string}"]  // Adds required attribute and required validation constraint to the element when the ngRequired expression evaluates to true. Use ngRequired instead of required when you want to data-bind to the required attribute.
         [ng-options="{comprehension_expression}"]>
  </select>
textarea
  <textarea
       ng-model="{string}" // Assignable angular expression to data-bind to.
       [name="{string}"]  //Property name of the form under which the control is published.
       [required]  // Sets required validation error key if the value is not entered.
       [ng-required="{string}"]  // Adds required attribute and required validation constraint to the element when the ngRequired expression evaluates to true. Use ngRequired instead of required when you want to data-bind to the required attribute.
       [ng-minlength="{number}"]  // Sets minlength validation error key if the value is shorter than minlength.
       [ng-maxlength="{number}"]  // Sets maxlength validation error key if the value is longer than maxlength.
       [ng-pattern="{string}"]  // Sets pattern validation error key if the value does not match the RegExp pattern expression. Expected value is /regexp/ for inline patterns or regexp for patterns defined as scope expressions.
       [ng-change="{string}"]>  // Angular expression to be executed when input changes due to user interaction with the input element.
  </textarea>

```