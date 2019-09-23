const swschema = {
    "$id": "https://wg-serverless.org/workflow.schema.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Workflow is a vendor-neutral specification for defining the format/primitives that the users can use to specify/describe their serverless application flow.",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "Workflow name",
            "minLength": 1
        },
        "trigger-defs": {
            "type": "array",
            "description": "Trigger Definitions",
            "items": {
                "type": "object",
                "$ref": "#/definitions/triggerevent"
            }
        },
        "states": {
            "type": "array",
            "description": "State Definitions",
            "items": {
                "type": "object",
                "anyOf": [{
                        "title": "Delay State",
                        "$ref": "#/definitions/delaystate"
                    },
                    {
                        "title": "End State",
                        "$ref": "#/definitions/endstate"
                    },
                    {
                        "title": "Event State",
                        "$ref": "#/definitions/eventstate"
                    },
                    {
                        "title": "Operation State",
                        "$ref": "#/definitions/operationstate"
                    },
                    {
                        "title": "Parallel State",
                        "$ref": "#/definitions/parallelstate"
                    },
                    {
                        "title": "Switch State",
                        "$ref": "#/definitions/switchstate"
                    }
                ]
            }
        }
    },
    "required": ["name", "states"],

    "definitions": {
        "triggerevent": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Trigger unique name",
                    "minLength": 1
                },
                "source": {
                    "type": "string",
                    "description": "CloudEvent source UUID"
                },
                "eventID": {
                    "type": "string",
                    "description": "CloudEvent eventID"
                },
                "correlation-token": {
                    "type": "string",
                    "description": "Path string to an identity label field in the event message"
                },
                "message": {
                    "type": "string",
                    "description": "Trigger event message"
                }
            }
        },
        "filter": {
            "type": "object",
            "javaType": "org.serverless.workflow.api.filters.Filter",
            "properties": {
                "input-path": {
                    "type": "string",
                    "description": "Select input data of either Event, State or Action as JSONPath"
                },
                "result-path": {
                    "type": "string",
                    "description": "Specify result JSON node of Action Output as JSONPath"
                },
                "output-path": {
                    "type": "string",
                    "description": "Specify output data of State or Action as JSONPath"
                }
            },
            "required": []
        },
        "event": {
            "type": "object",
            "properties": {
                "event-expression": {
                    "type": "string",
                    "description": "Boolean expression which consists of one or more Event operands and the Boolean operators"
                },
                "timeout": {
                    "type": "string",
                    "description": "Specifies the time period waiting for the events in the EVENTS-EXPRESSION"
                },
                "action-mode": {
                    "type": "string",
                    "enum": ["SEQUENTIAL", "PARALLEL"],
                    "description": "Specifies whether functions are executed in sequence or in parallel",
                    "format": "validactionmode"
                },
                "actions": {
                    "type": "array",
                    "description": "Action Definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/action"
                    }
                },
                "next-state": {
                    "type": "string",
                    "description": "Name of the next state to transition to after all the actions for the matching event have been successfully executed",
                    "minLength": 1
                },
                "filter": {
                    "$ref": "#/definitions/filter"
                }
            },
            "required": []
        },
        "action": {
            "type": "object",
            "properties": {
                "function": {
                    "description": "Specifies the function that must be invoked",
                    "$ref": "#/definitions/function"
                },
                "timeout": {
                    "type": "integer",
                    "default": "0",
                    "minimum": 0,
                    "description": "Specifies the time period waiting for the events in the EVENTS-EXPRESSION"
                },
                "retry": {
                    "type": "object",
                    "$ref": "#/definitions/retry",
                    "description": "Specifies how the result from a function is to be handled"
                },
                "filter": {
                    "$ref": "#/definitions/filter"
                }
            }
        },
        "retry": {
            "type": "object",
            "description": "Retry Definition",
            "properties": {
                "match": {
                    "type": "string",
                    "description": "Specifies the matching value for the result"
                },
                "retry-interval": {
                    "type": "integer",
                    "default": "0",
                    "minimum": 0,
                    "description": "Specifies retry interval"
                },
                "max-retry": {
                    "type": "integer",
                    "default": "0",
                    "minimum": 0,
                    "description": "Specifies the max retry"
                },
                "next-state": {
                    "type": "string",
                    "description": "Name of the next state to transition to when exceeding max-retry limit",
                    "minLength": 1
                }
            }
        },
        "function": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Function name",
                    "minLength": 1
                },
                "type": {
                    "type": "string",
                    "description": "Function type",
                    "minLength": 1
                },
                "parameters": {
                    "type": "object",
                    "description": "Function parameters",
                }
            }
        },
        "branch": {
            "type": "object",
            "description": "Branch Definition",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Branch name"
                },
                "states": {
                    "type": "array",
                    "description": "State Definitions",
                    "items": {
                        "type": "object",
                        "anyOf": [{
                                "title": "Delay State",
                                "$ref": "#/definitions/delaystate"
                            },
                            {
                                "title": "Event State",
                                "$ref": "#/definitions/eventstate"
                            },
                            {
                                "title": "Operation State",
                                "$ref": "#/definitions/operationstate"
                            },
                            {
                                "title": "Switch State",
                                "$ref": "#/definitions/switchstate"
                            }
                        ]
                    }
                }
            }
        },
        "defaultstate": {
            "type": "object",
            "description": "Default State",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Unique name of the state",
                    "minLength": 1
                },
                "type": {
                    "type": "string",
                    "enum": ["EVENT", "OPERATION", "SWITCH", "DELAY", "PARALLEL", "END"],
                    "description": "State type"
                },
                "start": {
                    "type": "boolean",
                    "default": false,
                    "description": "Is the start event"
                },
                "filter": {
                    "$ref": "#/definitions/filter"
                }
            },
        },
        "delaystate": {
            "type": "object",
            "description": "This state is used to wait for events from event sources and then transitioning to a next state",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Unique name of the state",
                    "minLength": 1
                },
                "type": {
                    "type": "string",
                    "enum": ["EVENT", "OPERATION", "SWITCH", "DELAY", "PARALLEL", "END"],
                    "description": "State type"
                },
                "start": {
                    "type": "boolean",
                    "default": false,
                    "description": "Is the start event"
                },
                "filter": {
                    "$ref": "#/definitions/filter"
                },
                "time-delay": {
                    "type": "integer",
                    "default": "0",
                    "minimum": 0,
                    "description": "Amount of time in seconds to delay in this state"
                },
                "next-state": {
                    "type": "string",
                    "description": "Name of the next state to transition to after all the actions for the matching event have been successfully executed",
                    "minLength": 1
                }
            }

        },
        "endstate": {
            "type": "object",
            "description": "End State",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Unique name of the state",
                    "minLength": 1
                },
                "type": {
                    "type": "string",
                    "enum": ["EVENT", "OPERATION", "SWITCH", "DELAY", "PARALLEL", "END"],
                    "description": "State type"
                },
                "start": {
                    "type": "boolean",
                    "default": false,
                    "description": "Is the start event"
                },
                "filter": {
                    "$ref": "#/definitions/filter"
                },
                "status": {
                    "type": "string",
                    "enum": ["SUCCESS", "FAILURE"],
                    "description": "Specifies the workflow termination status",
                    "format": "validstatus"
                }
            }
        },
        "eventstate": {
            "type": "object",
            "description": "This state is used to wait for events from event sources and then to invoke one or more functions to run in sequence or in parallel.",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Unique name of the state",
                    "minLength": 1
                },
                "type": {
                    "type": "string",
                    "enum": ["EVENT", "OPERATION", "SWITCH", "DELAY", "PARALLEL", "END"],
                    "description": "State type"
                },
                "start": {
                    "type": "boolean",
                    "default": false,
                    "description": "Is the start event"
                },
                "filter": {
                    "$ref": "#/definitions/filter"
                },
                "events": {
                    "type": "array",
                    "description": "Event State Definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/event"
                    }
                }
            }
        },
        "operationstate": {
            "type": "object",
            "description": "This state allows one or more functions to run in sequence or in parallel without waiting for any event.",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Unique name of the state",
                    "minLength": 1
                },
                "type": {
                    "type": "string",
                    "enum": ["EVENT", "OPERATION", "SWITCH", "DELAY", "PARALLEL", "END"],
                    "description": "State type"
                },
                "start": {
                    "type": "boolean",
                    "default": false,
                    "description": "Is the start event"
                },
                "filter": {
                    "$ref": "#/definitions/filter"
                },
                "action-mode": {
                    "type": "string",
                    "enum": ["SEQUENTIAL", "PARALLEL"],
                    "description": "Specifies whether functions are executed in sequence or in parallel."
                },
                "actions": {
                    "type": "array",
                    "description": "Actions Definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/action"
                    }
                },
                "next-state": {
                    "type": "string",
                    "description": "Name of the next state to transition to after all the actions have been successfully executed",
                    "minLength": 1
                }
            }
        },
        "parallelstate": {
            "type": "object",
            "description": "Consists of a number of states that are executed in parallel",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Unique name of the state",
                    "minLength": 1
                },
                "type": {
                    "type": "string",
                    "enum": ["EVENT", "OPERATION", "SWITCH", "DELAY", "PARALLEL", "END"],
                    "description": "State type"
                },
                "start": {
                    "type": "boolean",
                    "default": false,
                    "description": "Is the start event"
                },
                "filter": {
                    "$ref": "#/definitions/filter"
                },
                "branches": {
                    "type": "array",
                    "description": "Branch Definitions",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/branch"
                    }
                },
                "next-state": {
                    "type": "string",
                    "description": "Specifies the name of the next state to transition to after all branches have completed execution",
                    "minLength": 1
                }
            }
        },
        "switchstate": {
            "type": "object",
            "description": "Permits transitions to other states based on criteria matching",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Unique name of the state",
                    "minLength": 1
                },
                "type": {
                    "type": "string",
                    "enum": ["EVENT", "OPERATION", "SWITCH", "DELAY", "PARALLEL", "END"],
                    "description": "State type"
                },
                "start": {
                    "type": "boolean",
                    "default": false,
                    "description": "Is the start event"
                },
                "filter": {
                    "$ref": "#/definitions/filter"
                },
                "choices": {
                    "type": "array",
                    "description": "Defines an ordered set of Match Rules against the input data to this state",
                    "items": {
                        "type": "object",
                        "existingJavaType": "org.serverless.workflow.api.interfaces.Choice",
                        "anyOf": [{
                                "title": "And Choice",
                                "$ref": "#/definitions/andchoice"
                            },
                            {
                                "title": "Not Choice",
                                "$ref": "#/definitions/notchoice"
                            },
                            {
                                "title": "Or Choice",
                                "$ref": "#/definitions/orchoice"
                            }
                        ]
                    }
                },
                "default": {
                    "type": "string",
                    "description": "Specifies the name of the next state if there is no match for any choices value"
                }
            }
        },
        "defaultchoice": {
            "type": "object",
            "description": "Default Choice",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "JSON Path that selects the value of the input data to be matched"
                },
                "value": {
                    "type": "string",
                    "description": "Matching value"
                },
                "operator": {
                    "type": "string",
                    "enum": ["EQ", "LT", "LTEQ", "GT", "GTEQ", "StrEQ", "StrLT", "StrLTEQ", "StrGT", "StrGTEQ"],
                    "description": "Specifies how the input data is compared with the values",
                    "format": "validoperator"
                },
                "next-state": {
                    "type": "string",
                    "description": "Specifies the name of the next state to transition to if there is a value match",
                    "minLength": 1
                }
            }
        },
        "andchoice": {
            "type": "object",
            "description": "And Choice",
            "properties": {
                "and": {
                    "type": "array",
                    "description": "List of choices",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/defaultchoice"
                    }
                },
                "next-state": {
                    "type": "string",
                    "description": "Specifies the name of the next state to transition to if there is a value match",
                    "minLength": 1
                }
            }
        },
        "orchoice": {
            "type": "object",
            "description": "Or Choice",
            "properties": {
                "or": {
                    "type": "array",
                    "description": "List of choices",
                    "items": {
                        "type": "object",
                        "$ref": "#/definitions/defaultchoice"
                    }
                },
                "next-state": {
                    "type": "string",
                    "description": "Specifies the name of the next state to transition to if there is a value match",
                    "minLength": 1
                }
            }
        },
        "notchoice": {
            "type": "object",
            "description": "Not Choice",
            "properties": {
                "not": {
                    "type": "object",
                    "$ref": "#/definitions/defaultchoice",
                    "description": "Single Choice"
                },
                "next-state": {
                    "type": "string",
                    "description": "Specifies the name of the next state to transition to if there is a value match",
                    "minLength": 1
                }
            }
        }


    }
};

export default swschema;