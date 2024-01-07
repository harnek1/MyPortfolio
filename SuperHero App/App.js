import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';


const Stack = createNativeStackNavigator();


function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Welcome', headerTitleAlign: "center" }}
        />
        <Stack.Screen name="Search" options={{ title: 'Search', headerTitleAlign: "center" }} component={SearchScreen} />
        <Stack.Screen name="Details" options={{ title: 'Details', headerTitleAlign: "center" }} component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function HomeScreen({ navigation }) 
{

  return (
    <View style={styles.container}>

      <Text style={styles.text}>Welcome to the App that will allow you to know facts about your favourite Marvel and DC characters.
      </Text>

      <Button
        title="Enter The App"
        onPress={() => navigation.navigate('Search')
        }
      />

    </View>
  );

}



function SearchScreen({ navigation, route }) 
{

  const [text, setText] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [check_Error, setError] = useState('');
  const [check, setCheck] = useState(false);

  const controller = new AbortController();
  let isMounted = true;

  async function getSearchResults() {

    try {

      const response = await fetch('https://superheroapi.com/api/3495483570563471/search/' + text, { signal: controller.signal })

      const json = await response.json();
      if (isMounted) 
      {
        setData(json.results);

        if (check) 
        {

          if (text.length < 1) 
          {

            setError("Please enter at least one character.")

          } else if (text.length > 0 && json.response === "error") 
          {

            setError("Cannot find character")
          }

          if (text.length > 0 && json.response === "success") 
          {
            setError("")
          }
        }
          setCheck(true)
        }
      

    } catch (error) {
      console.error(error);

    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

  }

  useEffect(() => 
  {

    getSearchResults()
    navigation.addListener('focus', () => 
    {

      setText("")
      setData([]);
      setCheck(false);
      setError("")

    });
    return () => {
      controller.abort();
      isMounted = false;

    }
  }, []);



  return (

    <View style={styles.container}>

      <View style={{ flexDirection: "row" }}>
        <TextInput style={styles.input} value={text} onChangeText={text => setText(text)} placeholder="Please enter a character" />
        <Button onPress={() => { getSearchResults() }} title="Search" />
      </View>

      <Text style={styles.error}>{check_Error}</Text>

      {isLoading ? <ActivityIndicator /> : (
        <FlatList
          data={data}
          renderItem={({ item }) =>
            <View style={styles.flatListImage}>
              <Text>{item.name}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Details', { data: data, id: item.id })}>
                <Image style={styles.image} source={{ uri: item.image.url } } />
              </TouchableOpacity>
            </View>}
          keyExtractor={item => item.id} style={styles.flatList} />
      )}
    </View>
  );
}


function DetailsScreen({ navigation, route }) 
{

  const [data, setData] = useState([]);

  data.push(route.params.data.find(element => element.id === route.params.id))
  

  return (
    <ScrollView contentContainerStyle={{
      alignItems: 'center',
      justifyContent: 'center'
    }} >


      <Image style={styles.image} source={{ uri: data[0].image.url }} />

      <Text>Name: {data[0].name}</Text>

      <Text>Intelligence: {data[0].powerstats.intelligence}</Text>
      <Text>Strength: {data[0].powerstats.strength}</Text>
      <Text>Speed: {data[0].powerstats.speed}</Text>
      <Text>Durability: {data[0].powerstats.durability}</Text>
      <Text>Power: {data[0].powerstats.power}</Text>
      <Text>Combat: {data[0].powerstats.combat}</Text>

      <Text>Full-name: {data[0].biography["full-name"]}</Text>
      <Text>Alter-egos: {data[0].biography["alter-egos"]}</Text>
      <Text>Aliases: {data[0].biography.aliases + ","}</Text>
      <Text>Place-of-birth: {data[0].biography["place-of-birth"]}</Text>
      <Text>First-appearance: {data[0].biography["first-appearance"]}</Text>
      <Text>Publisher: {data[0].biography.publisher}</Text>
      <Text>Alignment: {data[0].biography.alignment}</Text>

      <Text>Gender: {data[0].appearance.gender}</Text>
      <Text>Race: {data[0].biography.race}</Text>
      <Text>Height: {data[0].biography.height}</Text>
      <Text>Weight: {data[0].appearance.weight + ","}</Text>
      <Text>Eye-color: {data[0].biography["eye-color"]}</Text>
      <Text>Hair-color: {data[0].biography["hair-color"]}</Text>

      <Text>Occupation: {data[0].work.occupation}</Text>
      <Text>Base: {data[0].work.base}</Text>


      <Text>Group-affiliation: {data[0].connections["group-affiliation"]}</Text>
      <Text>Relatives: {data[0].connections.relatives}</Text>


    </ScrollView>
  );


}

function App() 
{
  return (
    <MyStack />
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
  text:{
    marginBottom: 20
  },
  input: {
    borderWidth: 2
  },
  flatList: {
    marginTop: 20
  },
  flatListImage: {
    height: 100,
    marginBottom: 140,
  },
  image: {
    height: 200,
    width: 200,
  },
  error: {
    color: "red"
  }

});

export default App;

