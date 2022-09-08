import React, { useCallback, useLayoutEffect, useState } from "react";
import { BackHandler, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Searchbar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

import HeaderButton from "./HeaderButton";
import { useFocusEffect } from "@react-navigation/native";

const CustomSearchbar = ({
  navigation,
  searchHandler,
  headerHeight,
  searchQuery,
}) => {
  const [searchPressed, setSearchPressed] = useState(false);

  useLayoutEffect(() => {
    navigation.getParent().setOptions({
      headerTitle: searchPressed ? "" : "Rekeningen",

      headerTitleContainerStyle: {
        marginHorizontal: searchPressed ? 0 : 10,
      },
    });
  }, [searchPressed, navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (searchPressed) {
          setSearchPressed(false);
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [searchPressed])
  );

  return (
    <View style={{ flex: searchPressed ? 1 : 0 }}>
      {!searchPressed ? (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="search"
            IconComponent={MaterialIcons}
            iconName="search"
            onPress={() => setSearchPressed(true)}
          />
        </HeaderButtons>
      ) : (
        <Searchbar
          autoFocus
          style={{
            borderRadius: 25,
            marginRight: 10,
            height: 0.44 * headerHeight,
          }}
          inputStyle={{ padding: 0 }}
          placeholder="Zoeken"
          onChangeText={(query) => {
            searchHandler(query);
          }}
          value={searchQuery}
          icon="chevron-left"
          onIconPress={() => setSearchPressed(false)}
        />
      )}
    </View>
  );
};

export default CustomSearchbar;
