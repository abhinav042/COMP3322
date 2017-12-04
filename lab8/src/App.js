import React from 'react';
import ReactDOM from 'react-dom'; 

class FilterableProductTable extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
  filterText: '',
  inStockOnly: false,
  showCategory: true
  };
 
  this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
  this.handleInStockChange = this.handleInStockChange.bind(this);
  this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleFilterTextChange(filterText) {
  this.setState({
  filterText: filterText
  });
 }
 
  handleInStockChange(inStockOnly) {
  this.setState({
  inStockOnly: inStockOnly
  });
  }

  handleButtonClick() {
    this.setState({
      showCategory: !this.state.showCategory
    });
  }

  render() {
  return (
  <div>
  <SearchBar
  filterText={this.state.filterText}
  inStockOnly={this.state.inStockOnly}
  onFilterTextChange={this.handleFilterTextChange}
  onInStockChange={this.handleInStockChange}
  />
  <ProductTable
  products={this.props.products}
  showCategory={this.state.showCategory}
  filterText={this.state.filterText}
  inStockOnly={this.state.inStockOnly}
  />
  <ShowHideButton
  showCategory={this.state.showCategory}
  onButtonClick={this.handleButtonClick}
  />
  </div>
  );
  }
 }

 class SearchBar extends React.Component {
  constructor(props) {
  super(props);
  this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
  this.handleInStockChange = this.handleInStockChange.bind(this);
  }
 
  handleFilterTextChange(e) {
  this.props.onFilterTextChange(e.target.value);
  }
 
  handleInStockChange(e) {
  this.props.onInStockChange(e.target.checked);
  }
 
  render() {
  return (
  <form>
  <input type="text" placeholder="Search..." value={this.props.filterText}
  onChange={this.handleFilterTextChange} />
  <p>
  <input type="checkbox" checked={this.props.inStockOnly}
  onChange={this.handleInStockChange} />
  {' '}
  Only show products in stock
  </p>
  </form>
  );
  }
 }

 class ProductTable extends React.Component {
  render() {
  const filterText = this.props.filterText;
  const inStockOnly = this.props.inStockOnly;
  const rows = [];
  let lastCategory = null;
  this.props.products.map((product) => {
  if (product.name.indexOf(filterText) === -1) {
  return;
  }
  if (inStockOnly && !product.stocked) {
  return;
  }
  if (product.category !== lastCategory && this.props.showCategory) {
  rows.push(
  <ProductCategoryRow
  category={product.category}
  key={product.category} />
  );
  }
  rows.push(
  <ProductRow
  product={product}
  key={product.name}
  />
  );
  lastCategory = product.category;
  });
  return (
  <table>
  <thead>
  <tr>
  <th>Name</th>
  <th>Price</th>
  </tr>
  </thead>
  <tbody>{rows}</tbody>
  </table>
  );
  }
 }

 class ProductCategoryRow extends React.Component {
  render() {
  const category = this.props.category;
  return (
  <tr>
  <th colSpan="2">
  {category}
  </th>
  </tr>
  );
  }
 }
 class ProductRow extends React.Component {
  render() {
  const product = this.props.product;
  const name = product.stocked ?
  product.name :
  <span style={{color: 'red'}}>
  {product.name}
  </span>;
  return (
  <tr>
  <td>{name}</td>
  <td>{product.price}</td>
  </tr>
  );
  }
 }

class ShowHideButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    };

    handleButtonClick() {
      this.props.onButtonClick();
    }

   render() {
     return(
        <button onClick={this.handleButtonClick}>
          {this.props.showCategory?'Hide Category' : 'Show Category'}
        </button>
     );
   }
 }
 


 export default FilterableProductTable;