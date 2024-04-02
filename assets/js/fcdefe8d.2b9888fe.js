"use strict";(self.webpackChunk_synthql_docs=self.webpackChunk_synthql_docs||[]).push([[322],{186:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>l,frontMatter:()=>i,metadata:()=>a,toc:()=>u});var r=s(2322),t=s(5392);const i={},o="Query language",a={id:"query-language",title:"Query language",description:"synthql comes with a very basic query language. Let's see a few examples:",source:"@site/docs/300-query-language.md",sourceDirName:".",slug:"/query-language",permalink:"/synthql/docs/query-language",draft:!1,unlisted:!1,editUrl:"https://github.com/synthql/synthql/tree/master/packages/docs/docs/300-query-language.md",tags:[],version:"current",sidebarPosition:300,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Security",permalink:"/synthql/docs/security"},next:{title:"Query composition & reuse",permalink:"/synthql/docs/query-composition"}},d={},u=[{value:"Find user by ID",id:"find-user-by-id",level:2},{value:"Find users by IDs",id:"find-users-by-ids",level:2},{value:"Find users with pets (1 to n relation)",id:"find-users-with-pets-1-to-n-relation",level:2}];function c(e){const n={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,t.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"query-language",children:"Query language"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"synthql"})," comes with a very basic query language. Let's see a few examples:"]}),"\n",(0,r.jsx)(n.h2,{id:"find-user-by-id",children:"Find user by ID"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"import { from } from \"./db\";\n\nconst users = from('users')\n    .columns('id','name');\n\nexport function findUserById(id: string) {\n    return users\n        .where({ id })\n        .maybe()\n}\n"})}),"\n",(0,r.jsx)(n.h2,{id:"find-users-by-ids",children:"Find users by IDs"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:"import { from } from \"./db\";\n\nconst users = from('users')\n    .columns('id','name');\n\nexport function findUserById(ids: string[]) {\n    return users\n        .where({ id: { in: ids } })\n        .maybe()\n}\n"})}),"\n",(0,r.jsx)(n.h2,{id:"find-users-with-pets-1-to-n-relation",children:"Find users with pets (1 to n relation)"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-tsx",children:"import { from } from \"./db\";\n\nconst pets = from('pets')\n    .columns('id','name','owner_id');\n\nconst users = from('users')\n    .columns('id','name');\n\nexport function findUserByIds(ids: string[]) {\n    const pets = pets\n        .where({\n            owner_id: col('users.id')\n        })\n        .many();\n    return users\n        .include({\n            pets\n        })\n        .where({ id: { in: ids } })\n        .maybe()\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"This query will return the following shape:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"Array<{\n    id: string,\n    name: string,\n    pets: Array<{ id:string, name:string }>\n}>\n"})})]})}function l(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},5392:(e,n,s)=>{s.d(n,{Z:()=>a,a:()=>o});var r=s(2784);const t={},i=r.createContext(t);function o(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);