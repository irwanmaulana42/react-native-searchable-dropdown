import React, { Component } from 'react';
import {
  Text,
  FlatList,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

const defaultItemValue = {
  name: '',
  id: 0,
};

export default class SearchableDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      listItems: [],
      focus: false,
    };
  }

  componentDidMount = () => {
    const listItems = this.props.items || [];
    const defaultIndex = this.props.defaultIndex;
    if (defaultIndex && listItems.length > defaultIndex) {
      this.setState({
        listItems,
        item: listItems[defaultIndex],
      });
    } else {
      this.setState({ listItems });
    }
  };

  searchedItems = (searchedText) => {
    const setSort = this.props.setSort || ((item, text) =>
      item.name.toLowerCase().includes(text.toLowerCase()));

    const filteredItems = this.props.items.filter((item) =>
      setSort(item, searchedText)
    );

    this.setState({
      listItems: filteredItems,
      item: { id: -1, name: searchedText },
    });

    if (this.props.onTextChange) {
      this.props.onTextChange(searchedText);
    }
  };

  renderItems = (item, index) => {
    const isSelected = this.props.selectedItems
      ? this.props.selectedItems.some((selected) => selected.id === item.id)
      : false;
    
    return (
      <TouchableOpacity
        style={{ ...this.props.itemStyle }}
        onPress={() => {
          this.setState({ item, focus: false });
          Keyboard.dismiss();
          if (this.props.onItemSelect) {
            this.props.onItemSelect(item);
          }
  
          if (this.props.resetValue) {
            this.setState({ item: defaultItemValue });
          }
        }}
      >
        <Text style={{ ...this.props.itemTextStyle }}>
          {isSelected ? `✔ ${item.name}` : item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  
  renderFlatList = () => {
    if (this.state.focus) {
      return (
        <FlatList
          data={this.state.listItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => this.renderItems(item, index)}
          style={this.props.itemsContainerStyle}
          keyboardShouldPersistTaps="always"
        />
      );
    }
  };

  renderTextInput = () => {
    const value = this.state.item?.name || '';

    return (
      <TextInput
      ref={(input) => (this.input = input)}
      style={{ ...this.props.textInputStyle }}
      placeholder={this.props.placeholder || 'Search...'}
      value={value} // Pastikan 'value' tidak pernah undefined
      onChangeText={this.searchedItems}
      onFocus={() => this.setState({ focus: true })}
      onBlur={() => setTimeout(() => {
        this.setState({ focus: false })
      }, 100)}
      underlineColorAndroid={this.props.underlineColorAndroid || 'transparent'}
    />
    );
  };

  renderSelectedItems = () => {
    const { selectedItems, chip, multi } = this.props;

    if (multi && chip && selectedItems && selectedItems.length > 0) {
      return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
          {selectedItems.map((item, index) => (
            <View
              key={index}
              style={{
                padding: 8,
                margin: 5,
                borderRadius: 15,
                backgroundColor: '#eee',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#555' }}>{item.name}</Text>
              <TouchableOpacity
                onPress={() => {
                  if (this.props.onRemoveItem) {
                    this.props.onRemoveItem(item, index);
                  }
                }}
                style={{
                  backgroundColor: '#f16d6b',
                  width: 25,
                  height: 25,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 10,
                }}
              >
                <Text style={{ color: '#fff' }}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      );
    }
  };

  render = () => {
    return (
      <View style={{ ...this.props.containerStyle }}>
        {this.renderSelectedItems()}
        {this.renderTextInput()}
        {this.renderFlatList()}
      </View>
    );
  };
}
