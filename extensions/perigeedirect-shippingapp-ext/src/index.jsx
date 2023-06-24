import React, { useState } from "react";
import {
  render,
  TextField,
  BlockStack,
  useApplyMetafieldsChange,
  useBuyerJourneyIntercept,
  useMetafield,
  Checkbox,
  List,
  ListItem,
} from "@shopify/checkout-ui-extensions-react";


// Set the entry point for the extension
render("Checkout::DeliveryAddress::RenderBefore", () => <App />);
function App() {
  // Set up the checkbox state
 
  const [checked, setChecked] = useState(false);

  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [error3, setError3] = useState(false);
  

  // Define the metafield namespace and key
  const metafieldNamespace = "custom";

  const metafieldKey1 = "shipper_account_number";
  const metafieldKey2 = "courier_name";
  const metafieldKey3 = "service_level";

  // Get a reference to the metafield
  shipperaccount = useMetafield({ namespace: metafieldNamespace, key: metafieldKey1 });
  couriername    = useMetafield({ namespace: metafieldNamespace, key: metafieldKey2 });
  servicelevel   = useMetafield({ namespace: metafieldNamespace, key: metafieldKey3 });

  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();

  // Set a function to handle the Checkbox component's onChange event
  const handleChange = () => {
    
    setChecked(!checked);
    
    applyMetafieldsChange({ type: "removeMetafield", namespace: metafieldNamespace, key: metafieldKey1 });
    applyMetafieldsChange({ type: "removeMetafield", namespace: metafieldNamespace, key: metafieldKey2 });
    applyMetafieldsChange({ type: "removeMetafield", namespace: metafieldNamespace, key: metafieldKey3 });

  };

  useBuyerJourneyIntercept(() => {

    if (shipperaccount!=null && validateShipperAccount(shipperaccount.value)) setError1(false); 
    else setError1(true);

    if (couriername!=null && validateCourierName(couriername.value)) setError2(false);
    else setError2(true);

    if (servicelevel!=null && validateServiceLevel(servicelevel.value)) setError3(false);
    else setError3(true);

    if(checked && (error1 || error2 || error3)){
      return {
        behavior: "block",
        reason: "Form is not valid.",
        // if a partner tries block checkout, then `perform()` does not get called and nothing happens
        // acts like `behavior: allow`
        perform: () => showValidationUI(),
      };
    } else {
      return {
        behavior: "allow",
      };
    }
  });

  const showValidationUI = () => {
    console.log("validation UI");
  };

  const validateShipperAccount = (value) => {
    return value != "";
  };

  const validateCourierName = (value) => {
    return value != "";
  };

  const validateServiceLevel = (value) => {
    return value != "";
  };

  // Render the extension components
  return (
    <BlockStack>
      <Checkbox checked={checked} onChange={handleChange}>
          Collect Option: Apply shipping to my shipper account
      </Checkbox>

      {checked && (
        <TextField
          label="Shipper Account Number"
          error={error1 ? "Please provide a valid Shipper Account Number" : false}
          //multiline={3}
          onChange={(value) => {
            // Apply the change to the metafield
                if (validateShipperAccount(value)) {
                      setError1(false);
                    } else {
                      setError1(true);
                    }
                    applyMetafieldsChange({
                      type: "updateMetafield",
                      namespace: metafieldNamespace,
                      key: metafieldKey1,
                      valueType: "string",
                      value,
                    });
          }}
          value={shipperaccount?.value}
        />
      )}

      {checked && (
        <TextField
        label="Courier Name"
        error={error2 ? "Please provide a valid Courier Name" : false}
        onChange={(value) => {
          // Apply the change to the metafield
              if (validateCourierName(value)) {
                    applyMetafieldsChange({
                      type: "updateMetafield",
                      namespace: metafieldNamespace,
                      key: metafieldKey2,
                      valueType: "string",
                      value,
                    });
                    setError2(false);
                  } else {
                    setError2(true);
                  }
        }}
        value={couriername?.value}
      />
      )}

      {checked && (
       <TextField
       label="Service Level"
       error={error3 ? "Please provide a valid Service Level" : false}
       onChange={(value) => {
         // Apply the change to the metafield
            if (validateServiceLevel(value)) {
                  applyMetafieldsChange({
                    type: "updateMetafield",
                    namespace: metafieldNamespace,
                    key: metafieldKey3,
                    valueType: "string",
                    value,
                  });
                  setError3(false);
                } else {
                  setError3(true);
                }
       }}
       value={servicelevel?.value}
     />
      )}
    </BlockStack>
  );
}

render("Checkout::ShippingMethods::RenderBefore", () => <App2 />);
function App2() {
  // Define the metafield namespace and key
  const metafieldNamespace = "custom";

  const metafieldKey1 = "shipper_account_number";
  const metafieldKey2 = "courier_name";
  const metafieldKey3 = "service_level";

  // Get a reference to the metafield
  shipperaccount = useMetafield({ namespace: metafieldNamespace, key: metafieldKey1 });
  couriername    = useMetafield({ namespace: metafieldNamespace, key: metafieldKey2 });
  servicelevel   = useMetafield({ namespace: metafieldNamespace, key: metafieldKey3 });

  // Render the extension components
  if(shipperaccount!=null && couriername!=null && servicelevel!=null){
      return (
          <List>
            <ListItem>Shipper Account: { shipperaccount?.value }</ListItem>
            <ListItem>Courier Name: { couriername?.value } </ListItem>
            <ListItem>Service Level: { servicelevel?.value } </ListItem>
          </List>
      );

  }
  else
    return null;
}


