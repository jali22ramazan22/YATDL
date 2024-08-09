package main

import (
	"context"
	"encoding/json"
	"fmt"

	"gorm.io/gorm"
)

// can be saved in some env file
const DATABASE_NAME = "main_database.sqlite3"

type App struct {
	ctx           context.Context
	db_connection *gorm.DB
}

func NewApp() *App {
	return &App{}
}

// enchansing connection pooling when app is starting
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	var err error
	a.db_connection, err = establishDatabaseConnection(DATABASE_NAME)
	if err != nil {
		panic(err)
	}
	a.db_connection.AutoMigrate(structuresMap["Task"]())
}

// Not best implementation: the dublicate checking must be in lower level of abstraction
// in db.go file
func (a *App) GetEncodedTask(encodedTask string) string {
	parsedTask := deserializeStructure[Task](encodedTask, "Task")
	var existingTask Task
	result := a.db_connection.Where("title = ?", parsedTask.Title).First(&existingTask)

	if result.Error == nil {
		return "Duplicate record found"
	}
	if result.RowsAffected == 0 {
		saveStructure(a.db_connection, parsedTask)
	} else {
		return "Error while checking for duplicates"
	}

	return "Task saved successfully"
}

func (a *App) ReturnTasks() string {
	var tasks []Task
	err := retireAllStructures(a.db_connection, &tasks)
	if err != nil {
		panic(err)
	}
	serializedData, err := json.Marshal(tasks)
	if err != nil {
		panic(err)
	}
	return string(serializedData)
}

// Two methods below are communicating DB directly
// TODO: Write generic Delete/Update Row using reflections

func (a *App) DeleteTask(encodedTask string) string {
	parsedTask := deserializeStructure[Task](encodedTask, "Task")
	a.db_connection.Where("title = ?", parsedTask.Title).Delete(&Task{})
	return ""
}

func (a *App) UpdateTask(encodedTask string) string {
	parsedTask := deserializeStructure[Task](encodedTask, "Task")
	// a.db_connection.Model(&parsedTask).Where("title = ?", parsedTask.Title).Updates(&parsedTask)
	var existingTask Task
	if err := a.db_connection.Where("title = ?", parsedTask.Title).First(&existingTask).Error; err != nil {
		return fmt.Sprintf("Task with title %s not found: %v", parsedTask.Title, err)
	}

	parsedTask.ID = existingTask.ID
	if err := a.db_connection.Save(&parsedTask).Error; err != nil {
		return fmt.Sprintf("Failed to update task: %v", err)
	}

	return ""
}
