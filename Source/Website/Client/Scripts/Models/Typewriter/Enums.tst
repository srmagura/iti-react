${
    List<string> GetEnums(){ 
        return new List<string> {
            // Website
            "ErrorType"
        };
    }

    bool Test(string e){
        return GetEnums().Contains(e);
    }
}
$Enums(e => Test(e))[
export enum $Name { $Values[
	$Name = $Value,]
}]