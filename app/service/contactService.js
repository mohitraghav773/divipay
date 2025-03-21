import * as Contacts from 'expo-contacts';

export const getContacts = async () => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access contacts was denied");
      return [];
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
    });

    return data.filter((contact) => contact.phoneNumbers?.length);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
};
