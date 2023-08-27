import React, { useState, memo } from "react";
import { ScrollView, TouchableNativeFeedback, View } from "react-native";
import {
  Menu,
  IconButton,
  Text,
  Subheading,
  TouchableRipple,
} from "react-native-paper";

import Colors from "../../constants/Colors";
import useAsyncStorage from "../../hooks/useAsyncStorage";

const ReceiversMenu = ({ InsertReceiverFromMenu, receiversList }) => {
  const [visible, setVisible] = useState(false);
  const { deleteReceiver } = useAsyncStorage();

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          style={{ top: 10, marginLeft: 20 }}
          icon="notebook"
          iconColor={Colors.primary}
          size={34}
          onPress={openMenu}
        />
      }
      style={{ height: 150 }}
    >
      <ScrollView>
        {Object.entries(receiversList).length !== 0 ||
        receiversList === null ? (
          Object.entries(receiversList)
            .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
            .map((item, i) => (
              <View
                key={i}
                style={{
                  width: 280,
                  paddingLeft: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottomWidth:
                    Object.entries(receiversList).length - 1 !== i ? 0.5 : 0,
                  borderColor: "lightgrey",
                }}
              >
                <TouchableRipple
                  onPress={() => {
                    InsertReceiverFromMenu(item);
                    closeMenu();
                  }}
                  background={TouchableNativeFeedback.Ripple("#d9d9e6")}
                  style={{ flex: 1 }}
                  underlayColor="#ececf2"
                >
                  <View>
                    <Subheading style={{ fontFamily: "montserrat-medium" }}>
                      {item[0]}
                    </Subheading>
                    <Text
                      style={{
                        color: "grey",
                        fontFamily: "montserrat-medium",
                        paddingBottom: 5,
                      }}
                    >
                      {item[1]}
                    </Text>
                  </View>
                </TouchableRipple>
                <View
                  style={{ borderLeftWidth: 0.5, borderColor: "lightgrey" }}
                >
                  <IconButton
                    color={Colors.primary}
                    icon="trash-can-outline"
                    size={20}
                    onPress={() => {
                      deleteReceiver(item[1]);
                    }}
                  />
                </View>
              </View>
            ))
        ) : (
          <Menu.Item title="Geen opgeslagen ontvangers" />
        )}
      </ScrollView>
    </Menu>
  );
};

export default memo(ReceiversMenu);
