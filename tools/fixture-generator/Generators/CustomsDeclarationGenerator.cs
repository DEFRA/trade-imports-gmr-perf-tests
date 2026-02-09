using AutoFixture;
using AutoFixture.Kernel;
using Defra.TradeImportsDataApi.Domain.CustomsDeclaration;
using Defra.TradeImportsDataApi.Domain.Events;
using FixtureGenerator.Customizations;

namespace FixtureGenerator.Generators;

public static class CustomsDeclarationGenerator
{
    public static List<ResourceEvent<CustomsDeclaration>> Generate(int count, List<string> chedReferences)
    {
        var fixture = CreateFixture();
        var statuses = Enum.GetValues<MrnStatus>();
        var results = new List<ResourceEvent<CustomsDeclaration>>(count);

        for (var i = 0; i < count; i++)
        {
            var status = statuses[i % statuses.Length];
            var mrn = MrnGenerator.Generate(status);

            var refCount = (i % 3) + 1;
            var linkedChedRefs = chedReferences
                .Skip(i % Math.Max(1, chedReferences.Count - refCount))
                .Take(refCount)
                .ToList();

            var clearanceDecision = fixture.Build<ClearanceDecision>()
                .With(cd => cd.Results, linkedChedRefs
                    .Select(chedRef =>
                        fixture.Build<ClearanceDecisionResult>()
                            .With(x => x.ImportPreNotification, chedRef)
                            .Create()
                    )
                    .ToArray())
                .Create();

            var clearanceRequest = fixture.Build<ClearanceRequest>()
                .With(cr => cr.GoodsLocationCode, "POOPOOPOOGVM")
                .Create();

            var customsDeclaration = fixture.Build<CustomsDeclaration>()
                .With(c => c.ClearanceDecision, clearanceDecision)
                .With(c => c.ClearanceRequest, clearanceRequest)
                .Create();

            var resourceEvent = fixture.Build<ResourceEvent<CustomsDeclaration>>()
                .With(r => r.ResourceType, ResourceEventResourceTypes.CustomsDeclaration)
                .With(r => r.ResourceId, mrn)
                .With(r => r.Resource, customsDeclaration)
                .Create();

            results.Add(resourceEvent);
        }

        return results;
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
