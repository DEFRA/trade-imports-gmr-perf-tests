using AutoFixture;

namespace FixtureGenerator.Customizations;

public class DateOnlyCustomization : ICustomization
{
    public void Customize(IFixture fixture)
    {
        fixture.Register(() =>
        {
            var dateTime = fixture.Create<DateTime>();
            return DateOnly.FromDateTime(dateTime);
        });
    }
}
