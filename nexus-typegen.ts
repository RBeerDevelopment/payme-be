/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./src/context"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    datetime<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    datetime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
  Currency: "AUD" | "CNY" | "EUR" | "GBP" | "JPY" | "USD"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  AuthPayload: { // root type
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Mutation: {};
  Payment: { // root type
    amount: number; // Float!
    currency: string; // String!
    description?: string | null; // String
    id: string; // ID!
    isPaid: boolean; // Boolean!
    name: string; // String!
  }
  Paypal: { // root type
    accountName: string; // String!
    id: number; // Int!
    username: string; // String!
  }
  Query: {};
  Sepa: { // root type
    accountName?: string | null; // String
    bankName: string; // String!
    bic: string; // String!
    iban: string; // String!
    id: number; // Int!
  }
  User: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    email: string; // String!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
    lastSignin: NexusGenScalars['DateTime']; // DateTime!
    username: string; // String!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  AuthPayload: { // field return type
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Mutation: { // field return type
    addPayment: NexusGenRootTypes['Payment'] | null; // Payment
    addPaypal: NexusGenRootTypes['Paypal'] | null; // Paypal
    addSepa: NexusGenRootTypes['Sepa'] | null; // Sepa
    deletePayment: NexusGenRootTypes['Payment'] | null; // Payment
    deletePaypal: NexusGenRootTypes['Paypal'] | null; // Paypal
    deleteSepa: NexusGenRootTypes['Sepa'] | null; // Sepa
    login: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    markPaymentPaid: NexusGenRootTypes['Payment'] | null; // Payment
    signup: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    updatePayment: NexusGenRootTypes['Paypal'] | null; // Paypal
    updatePaypal: NexusGenRootTypes['Paypal'] | null; // Paypal
    updateSepa: NexusGenRootTypes['Sepa'] | null; // Sepa
  }
  Payment: { // field return type
    amount: number; // Float!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    createdBy: NexusGenRootTypes['User']; // User!
    currency: string; // String!
    description: string | null; // String
    id: string; // ID!
    isPaid: boolean; // Boolean!
    name: string; // String!
  }
  Paypal: { // field return type
    accountName: string; // String!
    id: number; // Int!
    user: NexusGenRootTypes['User']; // User!
    username: string; // String!
  }
  Query: { // field return type
    payment: NexusGenRootTypes['Payment'] | null; // Payment
    user: NexusGenRootTypes['User'] | null; // User
    users: Array<NexusGenRootTypes['User'] | null>; // [User]!
  }
  Sepa: { // field return type
    accountName: string | null; // String
    bankName: string; // String!
    bic: string; // String!
    iban: string; // String!
    id: number; // Int!
    user: NexusGenRootTypes['User']; // User!
  }
  User: { // field return type
    avatarUrl: string | null; // String
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    email: string; // String!
    firstName: string; // String!
    id: string; // ID!
    lastName: string; // String!
    lastSignin: NexusGenScalars['DateTime']; // DateTime!
    payments: Array<NexusGenRootTypes['Payment'] | null>; // [Payment]!
    paypal: Array<NexusGenRootTypes['Paypal'] | null>; // [Paypal]!
    sepa: Array<NexusGenRootTypes['Sepa'] | null>; // [Sepa]!
    username: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
  AuthPayload: { // field return type name
    token: 'String'
    user: 'User'
  }
  Mutation: { // field return type name
    addPayment: 'Payment'
    addPaypal: 'Paypal'
    addSepa: 'Sepa'
    deletePayment: 'Payment'
    deletePaypal: 'Paypal'
    deleteSepa: 'Sepa'
    login: 'AuthPayload'
    markPaymentPaid: 'Payment'
    signup: 'AuthPayload'
    updatePayment: 'Paypal'
    updatePaypal: 'Paypal'
    updateSepa: 'Sepa'
  }
  Payment: { // field return type name
    amount: 'Float'
    createdAt: 'DateTime'
    createdBy: 'User'
    currency: 'String'
    description: 'String'
    id: 'ID'
    isPaid: 'Boolean'
    name: 'String'
  }
  Paypal: { // field return type name
    accountName: 'String'
    id: 'Int'
    user: 'User'
    username: 'String'
  }
  Query: { // field return type name
    payment: 'Payment'
    user: 'User'
    users: 'User'
  }
  Sepa: { // field return type name
    accountName: 'String'
    bankName: 'String'
    bic: 'String'
    iban: 'String'
    id: 'Int'
    user: 'User'
  }
  User: { // field return type name
    avatarUrl: 'String'
    createdAt: 'DateTime'
    email: 'String'
    firstName: 'String'
    id: 'ID'
    lastName: 'String'
    lastSignin: 'DateTime'
    payments: 'Payment'
    paypal: 'Paypal'
    sepa: 'Sepa'
    username: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    addPayment: { // args
      amount: number; // Float!
      currency: NexusGenEnums['Currency']; // Currency!
      description?: string | null; // String
      name: string; // String!
    }
    addPaypal: { // args
      accountName?: string | null; // String
      username: string; // String!
    }
    addSepa: { // args
      accountName?: string | null; // String
      iban: string; // String!
    }
    deletePayment: { // args
      id: number; // Int!
    }
    deletePaypal: { // args
      id: number; // Int!
    }
    deleteSepa: { // args
      id: number; // Int!
    }
    login: { // args
      password: string; // String!
      username: string; // String!
    }
    markPaymentPaid: { // args
      id: number; // Int!
    }
    signup: { // args
      email: string; // String!
      firstName: string; // String!
      lastName: string; // String!
      password: string; // String!
      username: string; // String!
    }
    updatePayment: { // args
      amount?: string | null; // String
      currency: NexusGenEnums['Currency']; // Currency!
      description?: string | null; // String
      id: number; // Int!
      name?: string | null; // String
    }
    updatePaypal: { // args
      accountName?: string | null; // String
      id: number; // Int!
      username?: string | null; // String
    }
    updateSepa: { // args
      accountName?: string | null; // String
      bankName?: string | null; // String
      bic?: string | null; // String
      iban?: string | null; // String
      id: number; // Int!
    }
  }
  Query: {
    payment: { // args
      id?: number | null; // Int
    }
    user: { // args
      onlyActive?: boolean | null; // Boolean
      username?: string | null; // String
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}