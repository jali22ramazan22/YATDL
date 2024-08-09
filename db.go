package main

import (
	"fmt"

	_ "github.com/mattn/go-sqlite3"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func establishDatabaseConnection(databaseName string) (*gorm.DB, error) {
	databaseInstance, err := gorm.Open(sqlite.Open(databaseName), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}
	return databaseInstance, nil

}

// Inserting the generic structure into local database
func saveStructure[T any](connection *gorm.DB, instance T) {
	if connection == nil {
		fmt.Println("Empty connection")
		return
	}

	connection.Create(&instance)
}

func retireStructure[T any](connection *gorm.DB, typename string, target *string) (T, error) {
	instance := structuresMap[typename]().(T)
	connection.Where("title = ?", *target).First(&instance)
	return instance, nil
}

func retireAllStructures[T any](connection *gorm.DB, instances *[]T) error {
	result := connection.Find(instances)
	if result.Error != nil {
		return nil
	}
	return nil
}

// func deleteRecord[T any](connection *gorm.DB, typename string, titleValue interface{}) {
// 	instance := structuresMap[typename]().(T)
// 	t := reflect.TypeOf(instance)
// 	titleField := t.Field(3).Name
// 	connection.Where(fmt.Sprintf("%s = ?", titleField), titleValue).Delete(instance)
// }
