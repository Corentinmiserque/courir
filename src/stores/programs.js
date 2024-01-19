import { defineStore } from 'pinia';

export const useProgramStore = defineStore('program', {
  state: () => ({
    data: {
      "programs": [
        {
          "programID": "1",
          "name": "Beginner Running",
          "durationWeek": "12",
          "weeks": [
            {
              "weekID": "1",
              "finished": true,
              "days": [
                {
                  "dayID": "1",
                  "finished": true,
                  "sequences": [
                    {
                      "type": "warm-up",
                      "time": "0.1",
                      "finished": false
                    },
                    {
                      "type": "walk",
                      "time": "0.1",
                      "finished": false
                    },
                    {
                      "type": "trot",
                      "time": "0.1",
                      "finished": false
                    },
                    {
                      "type": "sprint",
                      "time": "0.1",
                      "finished": false
                    },
                    {
                      "type": "Stretching",
                      "time": "0.1",
                      "finished": false
                    }
                  ]
                },
                {
                  "dayID": "2",
                  "finished": false,
                  "sequences": [
                    {
                      "type": "warm-up",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "walk",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "trot",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "sprint",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "Stretching",
                      "time": "10",
                      "finished": false
                    }
                  ]
                },
                {
                  "dayID": "3",
                  "finished": false,
                  "sequences": [
                    {
                      "type": "warm-up",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "walk",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "trot",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "sprint",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "Stretching",
                      "time": "10",
                      "finished": false
                    }
                  ]
                }
              ]
            },
            {
              "weekID": "2",
              "finished": true,
              "days": [
                {
                  "dayID": "4",
                  "finished": true,
                  "sequences": [
                    {
                      "type": "warm-up",
                      "time": "1",
                      "finished": true
                    },
                    {
                      "type": "walk",
                      "time": "1",
                      "finished": true
                    },
                    {
                      "type": "trot",
                      "time": "1",
                      "finished": true
                    },
                    {
                      "type": "sprint",
                      "time": "1",
                      "finished": true
                    },
                    {
                      "type": "Stretching",
                      "time": "1",
                      "finished": true
                    }
                  ]
                },
                {
                  "dayID": "5",
                  "finished": true,
                  "sequences": [
                    {
                      "type": "warm-up",
                      "time": "5",
                      "finished": true
                    },
                    {
                      "type": "walk",
                      "time": "5",
                      "finished": true
                    },
                    {
                      "type": "trot",
                      "time": "5",
                      "finished": true
                    },
                    {
                      "type": "sprint",
                      "time": "5",
                      "finished": true
                    },
                    {
                      "type": "Stretching",
                      "time": "10",
                      "finished": true
                    }
                  ]
                },
                {
                  "dayID": "6",
                  "finished": false,
                  "sequences": [
                    {
                      "type": "warm-up",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "walk",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "trot",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "sprint",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "Stretching",
                      "time": "10",
                      "finished": false
                    }
                  ]
                },
                {
                  "dayID": "7",
                  "finished": false,
                  "sequences": [
                    {
                      "type": "warm-up",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "walk",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "trot",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "sprint",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "Stretching",
                      "time": "10",
                      "finished": false
                    }
                  ]
                }
              ]
            },
            {
              "weekID": "3",
              "finished": false,
              "days": [
                {
                  "dayID": "1",
                  "finished": true,
                  "sequences": [
                    {
                      "type": "warm-up",
                      "time": "1",
                      "finished": true
                    },
                    {
                      "type": "walk",
                      "time": "1",
                      "finished": true
                    },
                    {
                      "type": "trot",
                      "time": "1",
                      "finished": true
                    },
                    {
                      "type": "sprint",
                      "time": "1",
                      "finished": true
                    },
                    {
                      "type": "Stretching",
                      "time": "1",
                      "finished": true
                    }
                  ]
                },
                {
                  "dayID": "2",
                  "finished": false,
                  "sequences": [
                    {
                      "type": "warm-up",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "walk",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "trot",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "sprint",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "Stretching",
                      "time": "10",
                      "finished": false
                    }
                  ]
                },
                {
                  "dayID": "3",
                  "finished": false,
                  "sequences": [
                    {
                      "type": "warm-up",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "walk",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "trot",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "sprint",
                      "time": "5",
                      "finished": false
                    },
                    {
                      "type": "Stretching",
                      "time": "10",
                      "finished": false
                    }
                  ]
                },
              ]
            },
          ]
        }
      ]
    },
  }),

  actions: {
    getDaySequences(dayId) {
      const programs = this.data.programs;
      for (const program of programs) {
        for (const week of program.weeks) {
          for (const day of week.days) {
            if (day.dayID === dayId) {
              return day.sequences;
            }
          }
        }
      }
      return [];
    },
  },
});
