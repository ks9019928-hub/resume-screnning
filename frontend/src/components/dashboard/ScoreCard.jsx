import Card from "../common/Card";

function ScoreCard({ title, value, color }) {

  return (

    <Card>
      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <h1 className={`text-4xl font-bold mt-3 ${color}`}>
        {value}
      </h1>
    </Card>
  );
}

export default ScoreCard;