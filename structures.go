package main

import (
	"time"

	"gorm.io/gorm"
)

// The map that provides the Generic instanciation of structure for deserializer/serializer
var structuresMap = map[string]func() interface{}{
	"Task": func() interface{} {
		return createEmptyTask()
	},
}

type Priority int

type Task struct {
	gorm.Model
	Title        string     `json:"_title"`
	DueTo        time.Time  `json:"_dueTo"`
	Priority     Priority   `json:"_priority"`
	IsFinished   bool       `json:"_is_finished"`
	WhenFinished *time.Time `json:"_whenFinished"`
	Description  *string    `json:"_description"`
}

func createEmptyTask() *Task {
	return &Task{}
}
