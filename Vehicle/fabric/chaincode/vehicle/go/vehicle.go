/*
 SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-protos-go/peer"
)

//SmartContract is the data structure which represents this contract and on which  various contract lifecycle functions are attached
type SmartContract struct {
}

type Contract struct {
	ObjectType  string `json:"Type"`
	ContractID   string `json:"contractID"`
	SellerFullName    string `json:"sellerFullName"`
	SellerCNIC     string `json:"sellerCNIC"`
	SellerSecretKey string `json:"sellerSecretKey"`
	BuyerFullName       string `json:"buyerFullName"`
	BuyerCNIC string `json:"buyerCNIC"`
	BuyerSecretKey    string `json:"buyerSecretKey"`
	CarRegistrationNumber      string `json:"carRegistrationNumber"`
	Price      string `json:"price"`
	CarMake      string `json:"carMake"`
	CarModel      string `json:"carModel"`
	RegistrationCity      string `json:"registrationCity"`
	EngineType      string `json:"engineType"`
	EngineCapacity      string `json:"engineCapacity"`
    Transmission      string `json:"transmission"`
	Color      string `json:"color"`
	Image      string `json:"image"`


}

func (t *SmartContract) Init(stub shim.ChaincodeStubInterface) peer.Response {

	fmt.Println("Init Firing!")
	return shim.Success(nil)
}

func (t *SmartContract) Invoke(stub shim.ChaincodeStubInterface) peer.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("Chaincode Invoke Is Running " + function)
	if function == "addContract" {
		return t.addContract(stub, args)
	}
	if function == "queryContractBySellerName" {
		return t.queryContractBySellerName(stub, args)
	}
	if function == "queryContractBySellerCNIC" {
		return t.queryContractBySellerCNIC(stub, args)
	}
	if function == "queryContractByBuyerName" {
		return t.queryContractByBuyerName(stub, args)
	}
	if function == "queryContractByBuyerCNIC" {
		return t.queryContractByBuyerCNIC(stub, args)
	}
	if function == "queryContractByCarRegistrationNumber" {
		return t.queryContractByCarRegistrationNumber(stub, args)
	}
	if function == "queryContractByID" {
		return t.queryContractByID(stub, args)
	}
	if function == "queryAllContracts" {
		return t.queryAllContracts(stub, args)
	}

	fmt.Println("Invoke did not find specified function " + function)
	return shim.Error("Invoke did not find specified function " + function)
}

func (t *SmartContract) addContract(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	var err error

	if len(args) != 17 {
		return shim.Error("Incorrect Number of Aruments. Expecting 17")
	}

	fmt.Println("Adding new Contract")

	// ==== Input sanitation ====
	if len(args[0]) <= 0 {
		return shim.Error("1st Argument Must be a Non-Empty String")
	}
	if len(args[1]) <= 0 {
		return shim.Error("2nd Argument Must be a Non-Empty String")
	}
	if len(args[2]) <= 0 {
		return shim.Error("3rd Argument Must be a Non-Empty String")
	}
	if len(args[3]) <= 0 {
		return shim.Error("4th Argument Must be a Non-Empty String")
	}
	if len(args[4]) <= 0 {
		return shim.Error("5th Argument Must be a Non-Empty String")
	}
	if len(args[5]) <= 0 {
		return shim.Error("6th Argument Must be a Non-Empty String")
	}
	if len(args[6]) <= 0 {
		return shim.Error("7th Argument Must be a Non-Empty String")
	}
	if len(args[7]) <= 0 {
		return shim.Error("8th Argument Must be a Non-Empty String")
	}
	if len(args[8]) <= 0 {
		return shim.Error("8th Argument Must be a Non-Empty String")
	}
	if len(args[9]) <= 0 {
		return shim.Error("8th Argument Must be a Non-Empty String")
	}
	if len(args[10]) <= 0 {
		return shim.Error("8th Argument Must be a Non-Empty String")
	}
	if len(args[11]) <= 0 {
		return shim.Error("8th Argument Must be a Non-Empty String")
	}
	if len(args[12]) <= 0 {
		return shim.Error("8th Argument Must be a Non-Empty String")
	}
	if len(args[13]) <= 0 {
		return shim.Error("8th Argument Must be a Non-Empty String")
	}
	if len(args[14]) <= 0 {
		return shim.Error("8th Argument Must be a Non-Empty String")
	}
	if len(args[15]) <= 0 {
		return shim.Error("8th Argument Must be a Non-Empty String")
	}
	if len(args[16]) <= 0 {
		return shim.Error("8th Argument Must be a Non-Empty String")
	}


	contractID := args[0]
	sellerFullName := args[1]
	sellerCNIC := args[2]
	sellerSecretKey := args[3]
	buyerFullName := args[4]
	buyerCNIC := args[5]
	buyerSecretKey := args[6]
	carRegistrationNumber := args[7]
	price := args[8]
	carMake := args[9]
	carModel := args[10]
	registrationCity := args[11]
	engineType := args[12]
	engineCapacity := args[13]
	transmission := args[14]
	color := args[15]
	image := args[16]


	// ======Check if contract Already exists

	contractAsBytes, err := stub.GetState(contractID)
	if err != nil {
		return shim.Error("Transaction Failed with Error: " + err.Error())
	} else if contractAsBytes != nil {
		return shim.Error("The Inserted contract ID already Exists: " + contractID)
	}

	// ===== Create contract Object and Marshal to JSON

	objectType := "contract"
	contract := &Contract{objectType, contractID, sellerFullName, sellerCNIC, sellerSecretKey, buyerFullName, buyerCNIC, buyerSecretKey, carRegistrationNumber,price,carMake,carModel,registrationCity,engineType,engineCapacity,transmission,color,image}
	contractJSONasBytes, err := json.Marshal(contract)

	if err != nil {
		return shim.Error(err.Error())
	}

	// ======= Save contract to State

	err = stub.PutState(contractID, contractJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	// ======= Return Success

	fmt.Println("Successfully Saved contract")
	return shim.Success(nil)
}

func (t *SmartContract) queryContractBySellerName(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	sellerFullName := args[0]

	queryString := fmt.Sprintf("{\"selector\":{\"Type\":\"contract\",\"sellerFullName\":\"%s\"}}", sellerFullName)
	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(queryResults)
}

func (t *SmartContract) queryContractBySellerCNIC(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	sellerCNIC := args[0]

	queryString := fmt.Sprintf("{\"selector\":{\"Type\":\"contract\",\"sellerCNIC\":\"%s\"}}", sellerCNIC)
	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(queryResults)
}

func (t *SmartContract) queryContractByBuyerName(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	buyerFullName := args[0]

	queryString := fmt.Sprintf("{\"selector\":{\"Type\":\"contract\",\"buyerFullName\":\"%s\"}}", buyerFullName)
	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(queryResults)
}

func (t *SmartContract) queryContractByBuyerCNIC(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	buyerCNIC := args[0]

	queryString := fmt.Sprintf("{\"selector\":{\"Type\":\"contract\",\"buyerCNIC\":\"%s\"}}", buyerCNIC)
	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(queryResults)
}

func (t *SmartContract) queryContractByCarRegistrationNumber(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	carRegistrationNumber := args[0]

	queryString := fmt.Sprintf("{\"selector\":{\"Type\":\"contract\",\"carRegistrationNumber\":\"%s\"}}", carRegistrationNumber)
	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(queryResults)
}

func (t *SmartContract) queryContractByID(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	contractID := args[0]

	queryString := fmt.Sprintf("{\"selector\":{\"Type\":\"contract\",\"contractID\":\"%s\"}}", contractID)
	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(queryResults)
}

func (t *SmartContract) queryAllContracts(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	queryString := fmt.Sprintf("{\"selector\":{\"Type\":\"contract\"}}")

	queryResults, err := getQueryResultForQueryString(stub, queryString)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(queryResults)
}

func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {

	fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)

	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryRecords
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())

	return buffer.Bytes(), nil
}

//Main Function starts up the Chaincode
func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Smart Contract could not be run. Error Occured: %s", err)
	} else {
		fmt.Println("Smart Contract successfully Initiated")
	}
}
