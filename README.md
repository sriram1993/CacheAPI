# CacheAPI

The Cache API has been implemented with a base project structure for express

The following are the endpoints:

  -**POST**  : http://localhost:3003/cache - Create a new cache  
  -**PUT**  : http://localhost:3003/cache - Update a Cache Value for a specific Key    
  -**GET**  : http://localhost:3003/cache - Get all Cache stored in database  
  -**GET**  : http://localhost:3003/cache/{key} - Get Cache data for a specific key  
  -**DELETE**  : http://localhost:3003/cache/{key} - Delete a Cache Value for a specific Key    
  -**DELETE**  : http://localhost:3003/cache - Delete all cache data in the database    
  
The configuration specific to caches and database can be found under config folder  

# Overwritting a Cache

Once the cache threshold is reached, no new data can be inserted to the cache. The data is overwritten based on the following approach:
  - Sort the data based on the accessCount and timeToLive. 
  - By doing this, the least accessed cache is retreived along with its ID.
  - Update the ID with new key and Value and reset the Time to Live and accessCount variable for that key
