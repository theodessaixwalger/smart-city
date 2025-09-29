import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  modalTitle: {
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },

  filterSectionTitle: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 14,
    color: '#555',
  },

  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginVertical: 5,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterOptionActive: {
    backgroundColor: '#4A90E2',
  },

  filterOptionInactive: {
    backgroundColor: '#f0f0f0',
  },

  filterOptionTextActive: {
    color: 'white',
    fontWeight: '600',
  },

  filterOptionTextInactive: {
    color: '#555',
  },

  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },

  closeModalButton: {
    marginTop: 20,
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },

  closeModalText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
