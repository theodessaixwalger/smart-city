import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    color: "white",
    fontWeight: "500",
    marginBottom: 50,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  link: {
    textDecorationLine: "none",
  },
  buttonText: {
    color: "#4A90E2",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});
