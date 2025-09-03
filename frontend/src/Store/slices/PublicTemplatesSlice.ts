import type { publicTemplates, template } from "@/apiEndpoints/Templates";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: publicTemplates = {
    publicTemplates: []
}

const PublicTemplatesSlice = createSlice({
    name: 'publicTemplates',
    initialState: initialState,
    reducers: {
        setPublicTemplates:(state: any, action: PayloadAction<template[]>) =>{
            state.publicTemplates = action.payload;
        }
    }
});

export const { setPublicTemplates } = PublicTemplatesSlice.actions;
export default PublicTemplatesSlice.reducer;