import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions, StyleSheet } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import Colors from "../../constants/Colors";

const TRANSLATE_X_THRESHOLD = 40;
const TRANSLATE_X_MAX = TRANSLATE_X_THRESHOLD * 2;
const LIST_ITEM_HEIGHT = 150;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SwipeableView = ({
  children,
  onDeletePress,
  onPayedPress,
  activeFilters,
  simultaneousHandlers,
  billItem,
}) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const marginVertical = useSharedValue(15);
  const itemHeight = useSharedValue(LIST_ITEM_HEIGHT);
  const swipeGesture = useAnimatedGestureHandler(
    {
      onStart: (_, context) => {
        context.startX = translateX.value;
      },
      onActive: (event, context) => {
        if (billItem.deletionDate) return;

        if (billItem.paymentDate) {
          translateX.value = Math.min(
            Math.max(context.startX + event.translationX, -TRANSLATE_X_MAX),
            0
          );
        } else {
          translateX.value = Math.min(
            Math.max(context.startX + event.translationX, -TRANSLATE_X_MAX),
            TRANSLATE_X_MAX
          );
        }
      },
      onEnd: () => {
        if (translateX.value > TRANSLATE_X_THRESHOLD) {
          translateX.value = withTiming(TRANSLATE_X_MAX - 10);
        } else if (translateX.value < -TRANSLATE_X_THRESHOLD) {
          translateX.value = withTiming(-TRANSLATE_X_MAX + 10);
        } else {
          translateX.value = withTiming(0);
        }
      },
    },
    []
  );

  const handleDeletePress = () => {
    translateX.value = withTiming(-SCREEN_WIDTH);
    itemHeight.value = withTiming(0);
    marginVertical.value = withTiming(0);
    opacity.value = withTiming(0, undefined, (isFinished) => {
      if (isFinished && onDeletePress) {
        runOnJS(onDeletePress)(billItem.id);
      }
    });
  };

  const handlePayedPress = () => {
    if (activeFilters.filterPayedBills) {
      translateX.value = withTiming(0, undefined, (isFinished) => {
        if (isFinished && onPayedPress) {
          runOnJS(onPayedPress)(billItem.id);
        }
      });
    } else {
      translateX.value = withTiming(SCREEN_WIDTH);
      itemHeight.value = withTiming(0);
      marginVertical.value = withTiming(0);
      opacity.value = withTiming(0, undefined, (isFinished) => {
        if (isFinished && onPayedPress) {
          runOnJS(onPayedPress)(billItem.id);
        }
      });
    }
  };

  const rBillItemStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  const rIconStyle = useAnimatedStyle(() => {
    const opacity = withTiming(
      translateX.value < TRANSLATE_X_THRESHOLD &&
        translateX.value > -TRANSLATE_X_THRESHOLD
        ? 0
        : 1
    );
    return { opacity };
  }, []);

  const rBillItemContainerStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: marginVertical.value,
      opacity: opacity.value,
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View
        style={[styles.billItemContainer, rBillItemContainerStyle]}
      >
        <Animated.View
          style={[
            rIconStyle,
            {
              position: "absolute",
              left: "5%",
              overflow: "hidden",
              borderRadius: 50,
            },
          ]}
        >
          <Pressable
            style={styles.iconContainer}
            android_ripple={{ color: "#F3F3F3" }}
            onPress={handlePayedPress}
          >
            <MaterialCommunityIcons name="check-bold" size={30} color="white" />
          </Pressable>
        </Animated.View>

        <Animated.View
          style={[
            rIconStyle,
            {
              position: "absolute",
              right: "5%",
              overflow: "hidden",
              borderRadius: 50,
            },
          ]}
        >
          <Pressable
            style={styles.iconContainer}
            android_ripple={{ color: "#F3F3F3" }}
            onPress={handleDeletePress}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="white"
            />
          </Pressable>
        </Animated.View>
        <PanGestureHandler
          failOffsetY={[-5, 5]}
          activeOffsetX={[-5, 5]}
          simultaneousHandlers={simultaneousHandlers}
          onGestureEvent={swipeGesture}
        >
          <Animated.View style={[styles.billItem, rBillItemStyle]}>
            {children}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

export default SwipeableView;

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: Colors.primaryTint,
    borderRadius: 50,
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  billItemContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  billItem: {
    width: "90%",
    borderRadius: 10,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
    elevation: 5,
    height: 150,
  },
});
