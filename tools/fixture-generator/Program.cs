using System.Text.Json;
using System.Text.Json.Serialization;
using FixtureGenerator.Generators;

var outputPath = args.Length > 0 ? args[0] : "../../src/data";
var count = args.Length > 1 ? int.Parse(args[1]) : 150;

Directory.CreateDirectory(outputPath);

var jsonOptions = new JsonSerializerOptions
{
    WriteIndented = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
};

Console.WriteLine($"Generating {count} ImportPreNotification fixtures...");
var importPreNotifications = ImportPreNotificationGenerator.Generate(count);

var ipnPath = Path.Combine(outputPath, "import-pre-notifications.json");
var ipnJson = JsonSerializer.Serialize(importPreNotifications, jsonOptions);
File.WriteAllText(ipnPath, ipnJson);
Console.WriteLine($"  Written to {ipnPath}");

var chedReferences = importPreNotifications
    .Select(e => e.ResourceId!)
    .ToList();

Console.WriteLine($"Generating {count} CustomsDeclaration fixtures...");
var customsDeclarations = CustomsDeclarationGenerator.Generate(count, chedReferences);

var cdPath = Path.Combine(outputPath, "customs-declarations.json");
var cdJson = JsonSerializer.Serialize(customsDeclarations, jsonOptions);
File.WriteAllText(cdPath, cdJson);
Console.WriteLine($"  Written to {cdPath}");

Console.WriteLine("Done.");
