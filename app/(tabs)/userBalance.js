import { useEffect, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";



export default function BalancesScreen() {
  const { userId } = useLocalSearchParams();
  const [balances, setBalances] = useState({});
  const auth = getAuth();
  //const userLocalId = auth.currentUser?.uid;
  useEffect(() => {
      
    fetch(`http://192.168.31.49:5000/api//${userId}`)
      .then((response) => response.json())
      .then((data) => {
          setBalances(data.balances);
        })
      .catch(     
          (error) => { 
            console.error("Error fetching balances:", error)
            Alert.alert(error.message);  
          });
  }, [userId]);
  /*

  */
  return ( 
    <View>
      <Text>Who Owes Whom?</Text>
      <FlatList 
        data={Object.entries(balances || {})} // Ensure balances is always an object
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => (
          <Text>
              {item[0]} owes {item[1] >= 0 ? `You ₹${item[1]}` : `₹${-item[1]} to others`}
          </Text>
        )}
        ListEmptyComponent={<Text>No balances found</Text>} // Handle empty case
      />
    </View>
  );
}
