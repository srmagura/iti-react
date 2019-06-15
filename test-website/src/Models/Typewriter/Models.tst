${
    // NOT THE LATEST VERSION OF THE TYPEWRITER TEMPLATE

    List<string> GetClasses(){ 
        return new List<string> {
            "ProductDto",
            "ProductListDto",
            "ErrorDto",
            "UserDto",
            "EmailAddress",
            "UserLogInDto",
        };
    }

    List<string> GetExclusions(){ 
        return new List<string> {
        };
    }

    bool Test(Class c){
        return (GetClasses().Contains(c.Name) && !GetExclusions().Contains(c.Name));
    }

    string Imports(Class c){
        var classes = GetClasses();
        var index = classes.IndexOf(c.Name);

        // If not found import everything
        if(index == -1)
            index = classes.Count;

        var toImport = classes.Take(index);

        var imports = "";
        foreach(var className in toImport){
            imports += $"import {{ {className} }} from './{className}';\n";
        }

        return imports;
    }

    string ExtendsStatement(Class c){
        if(c.BaseClass == null)
            return "";

        return "extends " + c.BaseClass.Name;
    }

     // Special cases for types
    string TypeString(Property prop){
        var type = prop.Type;
   
        var str = type.ToString();

        // Only affects nullable value types
        if(type.IsNullable)
            str += " | null";

        return str;
    }

    string TypeNameVariable(Class c) {
        return c.Name + "TypeName";
    }
}

$Classes(c => Test(c))[
$Imports
import { ErrorType } from './ErrorType'

export const $TypeNameVariable = '$Name'
export interface $Name$TypeParameters $ExtendsStatement { $Properties[
	$name: $TypeString]
}]
