import React from 'react';
import ReactDOM from 'react-dom';
import FilterableProductTable from './App';

const PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Electronics', price: '$849.00', stocked: true, name: 'Google Pixel 2'},
    {category: 'Electronics', price: '$999.00', stocked: false, name: 'iPhone X'},
    {category: 'Electronics', price: '$930.00', stocked: true, name: 'Samsung Note 8'}
];

ReactDOM.render(
    <FilterableProductTable products={PRODUCTS} />,
    document.getElementById('root')
   );