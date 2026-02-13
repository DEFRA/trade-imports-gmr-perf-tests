using System.Security.Cryptography;

namespace FixtureGenerator.Customizations;

public static class MrnGenerator
{
    private const string MrnCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public static string Generate(MrnStatus mrnStatus = MrnStatus.Embarked)
    {
        var randomCharacters = new string(
            Enumerable
                .Range(0, 13)
                .Select(_ => MrnCharacters[RandomNumberGenerator.GetInt32(MrnCharacters.Length)])
                .ToArray()
        );

        return $"{DateTime.UtcNow:yy}GB{randomCharacters}{(int)mrnStatus}";
    }
}
