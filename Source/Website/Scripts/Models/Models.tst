${
    // This file generates TypeScript classes for all of our DTOs and view models,
    // and adds the appropriate imports to handle classes with dependencies.
    //
    // For this to work, there must be only one C# class per file. 
    //
    // When you add a new C# class, add its name to the list in the GetClasses()
    // method. The order in the list matters, because, when generating class A,
    // all classes that come before A in the list will be added as imports.
    //
    // TypeWriter will automatically regenerate the TypeScript classes whenever one of the
    // C# classes changes.

    List<string> GetClasses(){ 
        return new List<string> {
            "ExampleUserDto",
            "ErrorDto",
            "ViewModel",
        };
    }

    List<string> GetExclusions(){ 
        return new List<string> {
            "RazorViewModel"
        };
    }

    bool Test(Class c){
        return (GetClasses().Contains(c.Name) || c.Name.EndsWith("ViewModel")) && !GetExclusions().Contains(c.Name);
    }

    string Imports(Class c){
        var classes = GetClasses();
        var index = classes.IndexOf(c.Name);

        // If not found import everything (for view models)
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

export const $TypeNameVariable = '$Name'
export interface $Name$TypeParameters $ExtendsStatement { $Properties[
	$name: $Type]
}]
