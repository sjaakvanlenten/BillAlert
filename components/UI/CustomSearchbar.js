import React, { useState } from 'react'
import { View } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { Searchbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import HeaderButton from './HeaderButton';

const CustomSearchbar = ({ setSearchPressHandler, searchHandler, searchPressed, headerHeight }) => {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <View style={{flex: searchPressed ? 1 : 0}}>
            {!searchPressed ? (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item 
                        title="search" 
                        IconComponent={MaterialIcons} 
                        iconName="search" 
                        onPress={() => setSearchPressHandler()} 
                    />
                </HeaderButtons>
            ) : (
                <View>
                    <Searchbar
                        autoFocus
                        style={{height: headerHeight * 0.44, borderRadius: 25, marginRight: 10}}
                        placeholder="Zoeken"
                        onChangeText={query => {
                            setSearchQuery(query)
                            searchHandler(query)
                        }}
                        value={searchQuery}
                        icon="chevron-left"
                        onIconPress={() => setSearchPressHandler()}
                    />    
                </View>
            )}
        </View>
    )
}

export default CustomSearchbar
