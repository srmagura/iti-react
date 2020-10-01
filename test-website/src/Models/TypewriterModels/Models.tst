${
    // Typewriter templates are in a separate ASP.NET Core project because Typewriter
    // does not currently support TypeScript projects: 
    // github.com/frhagn/Typewriter/issues/128
    //
    // cds-shared is able to import this project''s types thanks to yarn link. 

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
            "ProductDto",
            "ProductListDto",
            "ErrorDto",
            "UserDto",
            "EmailAddress",
            "UserLogInDto"
        };
    }

    List<string> GetClassesRequiringTypeName(){ 
        return new List<string> {
        };
    }

    bool Test(Class c){
        return GetClasses().Contains(c.Name);
    }

    List<Type> GetTypeArgumentsRecursive(Type type) {
        if(type.TypeArguments.Count == 0) {
            return new List<Type> { type };
        }
       
        return type.TypeArguments.SelectMany(GetTypeArgumentsRecursive).ToList();
    }

    bool HasGenericArgument(Type type, string className) {
        return GetTypeArgumentsRecursive(type).Any(t => t.Name == className);
    }

    string Imports(Class c){
        var classes = GetClasses();
        var index = classes.IndexOf(c.Name);

        // If not found import everything
        if(index == -1)
            index = classes.Count;

        var toImport = classes.Take(index).Where(className => {
            if(c.BaseClass != null && (
                c.BaseClass.Name == className ||
                c.BaseClass.TypeArguments.Any(arg => arg.Name == className)
            )) {
                return true;
            }
            
            if(c.Properties.Any(p => p.Type.Name == className || 
                HasGenericArgument(p.Type, className))) {
                return true;
            }

            return false;
        });

        var imports = "";
        foreach(var className in toImport){
            imports += $"import {{ {className} }} from './{className}';\n";
        }

        return imports;
    }
    string ExtendsStatement(Class c){
        if(c.BaseClass == null || c.BaseClass.Name == "ValueObject")
            return "";

        return "extends " + c.BaseClass.Name + c.BaseClass.TypeArguments;
    }

     // Special cases for types
    string TypeString(Property prop){
        var type = prop.Type;
   
        var str = type.ToString();

        str = str.Replace(nameof(System.DayOfWeek), "number");

        // Only affects nullable value types
        if(type.IsNullable)
            str += " | null";

        return str;
    }

    string TypeNameVariable(Class c) {
        return c.Name + "TypeName";
    }

    string TypeNameProperty(Class c) {
        if(GetClassesRequiringTypeName().Any(cc => cc == c.Name)) {
            return "\ntypeName: string";
        }

        return "";
    }
}

$Classes(c => Test(c))[
$Imports
import { 
    ErrorDtoType
} from '.'

export const $TypeNameVariable = '$Name'
export interface $Name$TypeParameters $ExtendsStatement { $Properties[
	$name: $TypeString]$TypeNameProperty
}]
