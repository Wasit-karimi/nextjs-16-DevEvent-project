import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import { notFound } from "next/navigation";

const url = process.env.NEXT_PUBLIC_BASE_URL;

const EvetDetailIem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTag = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1 5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

const eventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const request = await fetch(`${url}/api/events/${slug}`);
  const {
    event: {
      description,
      image,
      overview,
      date,
      time,
      location,
      mode,
      agenda,
      audience,
      orgainzer,
      tags,
    },
  } = await request.json();

  if (!description) return notFound();

  const bookings = 10

  const similarEvents : IEvent[] = await getSimilarEventsBySlug(slug)


  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="">{description}</p>
      </div>
      <div className="details">
        {/* Left Side - Event Content */}
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Detail</h2>
            <EvetDetailIem
              icon="/icons/calender.svg"
              alt="calender"
              label={date}
            />
            <EvetDetailIem icon="/icons/clock.svg" alt="clock" label={time} />
            <EvetDetailIem icon="/icons/pin.svg" alt="pin" label={location} />
            <EvetDetailIem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EvetDetailIem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>
          <EventAgenda agendaItems={agenda[0]} />

          <section className="flex-col-gap-2">
            <h2>About the organizer</h2>
            <p>{orgainzer}</p>
          </section>
          <EventTag tags={tags[0]} />
        </div>
        {/* Right Side - Booking Form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings>0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">
                Be the first to book your spot!
              </p>
            )}
             <BookEvent />
          </div>
        </aside>
      </div>
      <div className="flex-w-full flex-col gap-4">
        <h2>Similar Events</h2>
        {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
          <EventCard {...similarEvent} key={similarEvent.title} />
        ) )}
      </div>
    </section>
  );
};

export default eventDetailsPage;
