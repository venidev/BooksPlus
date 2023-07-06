import React, { useState, useEffect } from 'react';
import  { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
} from 'react-native';

const DATA_URL = 'http://de-coding-test.s3.amazonaws.com/books.json';

/*
  DTO for Book
*/

interface Book {
  title: string;
  author: string;
  imageURL: string;
}


interface Props {
  item: Book;
}

//BookItem component to render the book item in the flatlist
class BookItem extends PureComponent<Props> {
  render() {
    const { item } = this.props;
    return (
      <View style={styles.item}>
        <Image
          style={styles.thumbnail}
          source={{ uri: item.imageURL }}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          {item.author != null && (
            <Text style={styles.author}>Author: {item.author}</Text>
          )}
        </View>
      </View>
    );
  }
}



const App = () => {
  const [data, setData] = useState<Book[]>([]);
  const [filteredData, setFilteredData] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(''); 

  //makes use of useEffect to fetch data from the API
  useEffect(() => {
    fetchData();
  }, []);


//makes use of useEffect to filter data from the API
  useEffect(() => {
    filterData(searchText);
  }, [searchText, data]);


  //fetches data from the API using fetch api
  const fetchData = async () => {
    try {
      const response = await fetch(DATA_URL);
      const data = await response.json();
      setData(data);
      setFilteredData(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  //filters data from the API using filter api
  const filterData = (text: string) => {
    if (text) {
      const newData = data.filter((item) => {
        const itemData = `${item.title.toUpperCase()}`;
        if(item.author!=null) {
          itemData.concat(`${item.author.toUpperCase()}`);
        }
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(data);
    }
  };


  //render function for the flatlist
  const renderItem = ({ item }: { item: Book }) => (
    <View style={styles.item}>
      <Image
        style={styles.thumbnail}
        source={{ uri: item.imageURL }}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {item.author!=null && <Text style={styles.author}>Author: {item.author}</Text>} 

      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator testID="loader" size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center', margin: 10}}>Book List</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
      />
      <FlatList
        removeClippedSubviews={true}
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <BookItem item={item} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
  },
  description: {
    fontSize: 12,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 5,
    margin: 10,
  },
});

export default App;