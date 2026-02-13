using System.Security.Cryptography;
using AutoFixture;
using AutoFixture.Kernel;
using Defra.TradeImportsDataApi.Domain.Events;
using Defra.TradeImportsDataApi.Domain.Ipaffs;
using FixtureGenerator.Customizations;

namespace FixtureGenerator.Generators;

public static class  ImportPreNotificationGenerator
{
    private static readonly string[] ChedTypes = ["CHEDP", "CHEDPP", "CHEDA", "CHEDD"];

    public static List<ResourceEvent<ImportPreNotification>> Generate(int count)
    {
        var fixture = CreateFixture();
        var statuses = Enum.GetValues<MrnStatus>();
        var results = new List<ResourceEvent<ImportPreNotification>>(count);

        for (var i = 0; i < count; i++)
        {
            var status = statuses[i % statuses.Length];
            var mrn = MrnGenerator.Generate(status);
            var chedRef = GenerateRandomReference();

            var importPreNotification = fixture.Build<ImportPreNotification>()
                .With(x => x.ReferenceNumber, chedRef)
                .With(x => x.ExternalReferences, new[]
                {
                    new ExternalReference { Reference = mrn, System = "NCTS" }
                })
                .Create();

            var resourceEvent = fixture.Build<ResourceEvent<ImportPreNotification>>()
                .With(r => r.ResourceType, ResourceEventResourceTypes.ImportPreNotification)
                .With(r => r.ResourceId, chedRef)
                .With(r => r.Resource, importPreNotification)
                .Create();

            results.Add(resourceEvent);
        }

        return results;
    }

    private static string GenerateRandomReference()
    {
        var chedType = ChedTypes[RandomNumberGenerator.GetInt32(ChedTypes.Length)];
        var year = DateTime.UtcNow.Year;
        var number = RandomNumberGenerator.GetInt32(0, 10000000).ToString("D7");
        return $"{chedType}.GB.{year}.{number}";
    }

    private static Fixture CreateFixture()
    {
        var fixture = new Fixture();
        fixture.Customize(new DateOnlyCustomization());
        fixture.Behaviors.OfType<ThrowingRecursionBehavior>()
            .ToList()
            .ForEach(b => fixture.Behaviors.Remove(b));
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        return fixture;
    }
}
