import { StyleSheet } from "react-native";

export default StyleSheet.create({
  searchContainer: {
    position: "absolute",
    top: 15,
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 4,
    zIndex: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
});
