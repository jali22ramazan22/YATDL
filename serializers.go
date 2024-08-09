package main

import (
	"encoding/json"
	"fmt"
	"log"
)

//This package is aimed to provide a scalable and flexy serializer/deserializer
//For communicating with Frontend

func createInstance(typeName string) (interface{}, error) {
	constructor, exists := structuresMap[typeName]
	if !exists {
		return nil, fmt.Errorf("type %s not registered", typeName)
	}

	return constructor(), nil
}

// Generic deserialize function
func deserializeStructure[T any](data string, typename string) *T {

	instance, err := createInstance(typename)
	if err != nil {
		log.Println("Error creating instance:", err)
		return nil
	}

	// Unmarshal JSON data into the instance
	err = json.Unmarshal([]byte(data), instance)
	if err != nil {
		log.Println("Error deserializing:", err)
		return nil
	}

	return instance.(*T)
}

// Generic serializer from T -> JSON
func serializeStructure[T any](structure T) []byte {
	serializedData, err := json.Marshal(structure)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return serializedData
}
