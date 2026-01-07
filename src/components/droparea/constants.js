import shortid from "shortid";

export const SIDEBAR_ITEM = "sidebarItem";
export const ROW = "row";
export const COLUMN = "column";
export const COMPONENT = "component";
export const COMPONENTROW = "componentrow"; 

export const SIDEBAR_ITEMS = [
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      inputtype: "TextInput",
      content: "Some input",
      label:"ProductCategory",
      sdisplayname:"sproductcatname"
    }
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      inputtype: "TextInput",
      content: "Some input",
      label:"Description",
      sdisplayname:"sdescription"
    }
  },
  // {
  //   id: shortid.generate(),
  //   type: SIDEBAR_ITEM,
  //   component: {
  //     type: "name",
  //     content: "Some name"
  //   }
  // },
  // {
  //   id: shortid.generate(),
  //   type: SIDEBAR_ITEM,
  //   component: {
  //     type: "email",
  //     content: "Some email"
  //   }
  // },
  // {
  //   id: shortid.generate(),
  //   type: SIDEBAR_ITEM,
  //   component: {
  //     type: "phone",
  //     content: "Some phone"
  //   }
  // },
  // {
  //   id: shortid.generate(),
  //   type: SIDEBAR_ITEM,
  //   component: {
  //     type: "image",
  //     content: "Some image"
  //   }
  // }
];
