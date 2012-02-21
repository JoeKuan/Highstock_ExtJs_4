<?php
$general[] = array('text' => 'Single line series', 'id' => 'single_line', 'leaf' => true);
$general[] = array('text' => 'Two panes, candlestick and volume', 'id' => 'two_panes', 'leaf' => true);
$general[] = array('text' => 'Compare multiple series', 'id' => 'multi_series', 'leaf' => true);
$general[] = array('text' => '52,000 points with data grouping', 'id' => 'data_grouping', 'leaf' => true);
$general[] = array('text' => 'Intraday area', 'id' => 'intraday_area', 'leaf' => true);
$general[] = array('text' => 'Intraday candlestick', 'id' => 'intraday_candle', 'leaf' => true);
$general[] = array('text' => 'Flags marking event', 'id' => 'flags_marking', 'leaf' => true);
$general[] = array('text' => 'Dynamically updated data', 'id' => 'dynamic_update', 'leaf' => true);

$chartType[] = array('text' => 'Line with markers and shadow', 'id' => 'line_markers', 'leaf' => true);
$chartType[] = array('text' => 'Spline', 'id' => 'spline', 'leaf' => true);
$chartType[] = array('text' => 'Step line', 'id' => 'step', 'leaf' => true);
$chartType[] = array('text' => 'Area', 'id' => 'area', 'leaf' => true);
$chartType[] = array('text' => 'Areaspline', 'id' => 'areaspline', 'leaf' => true);
$chartType[] = array('text' => 'OHLC', 'id' => 'ohlc', 'leaf' => true);
$chartType[] = array('text' => 'Column', 'id' => 'column', 'leaf' => true);
$chartType[] = array('text' => 'Point Markers Only', 'id' => 'point_markers', 'leaf' => true);

$various[] = array('text' => 'Plot lines on Y axis', 'id' => 'lines_y_axis', 'leaf' => true);
$various[] = array('text' => 'Plot bands on Y axis', 'id' => 'bands_y_axis', 'leaf' => true);
$various[] = array('text' => 'Reversed Y axis', 'id' => 'reversed_y_axis', 'leaf' => true);
$various[] = array('text' => 'Styled scrollbar', 'id' => 'styled_scrollbar', 'leaf' => true);
$various[] = array('text' => 'Disabled scrollbar', 'id' => 'disabled_scrollbar', 'leaf' => true);
$various[] = array('text' => 'Disabled navigator', 'id' => 'disabled_navigator', 'leaf' => true);

$flags[] = array('text' => 'Flags placement', 'id' => 'flags_placement', 'leaf' => true);
$flags[] = array('text' => 'Flags shapes and colors', 'id' => 'flags_shapes', 'leaf' => true);

$result = array( array('text' => 'General', 'expanded' => true, 'children' => $general, 'leaf' => false), 
array('text' => 'Chart types', 'expanded' => true, 'leaf' => false, 'children' => $chartType), 
array('text' => 'Various Features', 'expanded' => true, 'leaf' => false, 'children' => $various),
array('text' => 'Flags', 'expanded' => true, 'leaf' => false, 'children' => $flags) 
);

echo json_encode($result);
?>